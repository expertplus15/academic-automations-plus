
-- Créer les tables pour le système d'alertes et documents administratifs (version corrigée)

-- Table pour les configurations de seuils d'alertes
CREATE TABLE public.alert_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type VARCHAR NOT NULL,
  program_id UUID REFERENCES public.programs(id),
  level_id UUID REFERENCES public.academic_levels(id),
  threshold_value NUMERIC NOT NULL,
  severity VARCHAR NOT NULL DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  message_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Table pour les templates de documents
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  template_type VARCHAR NOT NULL, -- 'certificate', 'transcript', 'attestation'
  template_content JSONB NOT NULL, -- Structure du template
  is_active BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les demandes de documents
CREATE TABLE public.document_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  template_id UUID NOT NULL REFERENCES public.document_templates(id),
  status VARCHAR NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'generated', 'delivered', 'rejected'
  request_data JSONB, -- Données spécifiques à la demande
  requested_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les documents générés
CREATE TABLE public.generated_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.document_requests(id),
  document_number VARCHAR NOT NULL UNIQUE,
  file_path TEXT,
  file_size BIGINT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  generated_by UUID REFERENCES public.profiles(id),
  is_valid BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMP WITH TIME ZONE
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour alert_configurations (corrigées)
CREATE POLICY "Admins can manage alert configurations" 
  ON public.alert_configurations 
  FOR ALL 
  USING (public.get_current_user_role() IN ('admin', 'teacher'));

CREATE POLICY "Users can view alert configurations" 
  ON public.alert_configurations 
  FOR SELECT 
  USING (true);

-- Politiques RLS pour document_templates (corrigées)
CREATE POLICY "Admins can manage document templates" 
  ON public.document_templates 
  FOR ALL 
  USING (public.get_current_user_role() IN ('admin', 'hr'));

CREATE POLICY "Users can view active templates" 
  ON public.document_templates 
  FOR SELECT 
  USING (is_active = true);

-- Politiques RLS pour document_requests (corrigées)
CREATE POLICY "Students can view their own requests" 
  ON public.document_requests 
  FOR SELECT 
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE profile_id = auth.uid()
    ) OR 
    public.get_current_user_role() IN ('admin', 'hr')
  );

CREATE POLICY "Students can create requests" 
  ON public.document_requests 
  FOR INSERT 
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.students WHERE profile_id = auth.uid()
    ) AND 
    requested_by = auth.uid()
  );

CREATE POLICY "Staff can manage requests" 
  ON public.document_requests 
  FOR ALL 
  USING (public.get_current_user_role() IN ('admin', 'hr'));

-- Politiques RLS pour generated_documents (corrigées)
CREATE POLICY "Users can view their documents" 
  ON public.generated_documents 
  FOR SELECT 
  USING (
    request_id IN (
      SELECT id FROM public.document_requests 
      WHERE student_id IN (
        SELECT id FROM public.students WHERE profile_id = auth.uid()
      )
    ) OR 
    public.get_current_user_role() IN ('admin', 'hr')
  );

CREATE POLICY "Staff can manage generated documents" 
  ON public.generated_documents 
  FOR ALL 
  USING (public.get_current_user_role() IN ('admin', 'hr'));

-- Insérer quelques templates de base
INSERT INTO public.document_templates (name, code, description, template_type, template_content) VALUES
('Certificat de Scolarité', 'CERT_SCOL', 'Certificat attestant de l''inscription d''un étudiant', 'certificate', '{
  "title": "CERTIFICAT DE SCOLARITÉ",
  "fields": ["student_name", "student_number", "program_name", "academic_year", "issue_date"],
  "template": "Je soussigné(e), certifie que {student_name}, numéro étudiant {student_number}, est régulièrement inscrit(e) en {program_name} pour l''année académique {academic_year}."
}'),
('Relevé de Notes', 'RELEVE_NOTES', 'Relevé des notes obtenues par l''étudiant', 'transcript', '{
  "title": "RELEVÉ DE NOTES",
  "fields": ["student_name", "student_number", "program_name", "semester", "grades", "issue_date"],
  "template": "Relevé de notes de {student_name} ({student_number}) pour le semestre {semester} en {program_name}."
}'),
('Attestation de Réussite', 'ATTEST_REUSSITE', 'Attestation de réussite d''un niveau ou diplôme', 'attestation', '{
  "title": "ATTESTATION DE RÉUSSITE",
  "fields": ["student_name", "student_number", "program_name", "completion_date", "issue_date"],
  "template": "Attestation de réussite délivrée à {student_name} ({student_number}) ayant validé avec succès le programme {program_name}."
}');

-- Insérer quelques configurations d'alertes de base
INSERT INTO public.alert_configurations (alert_type, threshold_value, severity, message_template) VALUES
('low_grade', 8, 'high', 'Moyenne inférieure à {threshold_value}/20 en {subject_name}'),
('excessive_absences', 20, 'critical', 'Taux d''absence de {current_value}% dépassé (seuil: {threshold_value}%)'),
('at_risk', 0.7, 'medium', 'Risque d''échec détecté par l''IA (probabilité: {current_value})');

-- Fonction pour générer un numéro de document unique
CREATE OR REPLACE FUNCTION public.generate_document_number(doc_type TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    year_suffix TEXT;
    next_sequence INTEGER;
    new_number TEXT;
BEGIN
    year_suffix := RIGHT(EXTRACT(YEAR FROM now())::TEXT, 2);
    
    SELECT COALESCE(MAX(
        CAST(RIGHT(document_number, 4) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM public.generated_documents
    WHERE document_number LIKE (doc_type || year_suffix || '%');
    
    new_number := doc_type || year_suffix || LPAD(next_sequence::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_alert_configurations_updated_at
    BEFORE UPDATE ON public.alert_configurations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();

CREATE TRIGGER update_document_templates_updated_at
    BEFORE UPDATE ON public.document_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();

CREATE TRIGGER update_document_requests_updated_at
    BEFORE UPDATE ON public.document_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();
