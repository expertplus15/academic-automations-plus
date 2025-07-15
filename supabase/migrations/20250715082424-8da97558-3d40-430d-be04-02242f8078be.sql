-- Create document templates table
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL,
  template_content JSONB DEFAULT '{}',
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create document variables table
CREATE TABLE public.document_variables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  label VARCHAR NOT NULL,
  variable_type VARCHAR NOT NULL DEFAULT 'text',
  category VARCHAR NOT NULL,
  description TEXT,
  default_value TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create document requests table
CREATE TABLE public.document_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  template_id UUID REFERENCES document_templates(id),
  requested_by UUID REFERENCES profiles(id),
  status VARCHAR DEFAULT 'pending',
  request_data JSONB DEFAULT '{}',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create generated documents table
CREATE TABLE public.generated_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES document_requests(id),
  template_id UUID REFERENCES document_templates(id),
  student_id UUID REFERENCES students(id),
  document_number VARCHAR UNIQUE,
  file_url TEXT,
  generated_by UUID REFERENCES profiles(id),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_templates
CREATE POLICY "Anyone can view active templates" ON public.document_templates 
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage templates" ON public.document_templates 
FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- RLS Policies for document_variables
CREATE POLICY "Anyone can view variables" ON public.document_variables 
FOR SELECT USING (true);

CREATE POLICY "Admin can manage variables" ON public.document_variables 
FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- RLS Policies for document_requests
CREATE POLICY "Users can view own requests" ON public.document_requests 
FOR SELECT USING (
  requested_by = auth.uid() OR 
  student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
  get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Users can create requests" ON public.document_requests 
FOR INSERT WITH CHECK (
  requested_by = auth.uid() OR 
  get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Admin can manage requests" ON public.document_requests 
FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- RLS Policies for generated_documents
CREATE POLICY "Users can view own documents" ON public.generated_documents 
FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
  get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Admin can manage documents" ON public.generated_documents 
FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Insert default document variables
INSERT INTO public.document_variables (name, label, variable_type, category, description) VALUES
('student_name', 'Nom de l''étudiant', 'text', 'student', 'Nom complet de l''étudiant'),
('student_number', 'Numéro étudiant', 'text', 'student', 'Numéro d''identification unique'),
('academic_year', 'Année académique', 'text', 'academic', 'Année scolaire en cours'),
('program_name', 'Programme d''études', 'text', 'academic', 'Nom du programme ou filière'),
('issue_date', 'Date d''émission', 'date', 'document', 'Date de génération du document'),
('institution_name', 'Nom de l''établissement', 'text', 'institution', 'Nom officiel de l''institution');

-- Insert default document templates
INSERT INTO public.document_templates (name, description, category, template_content, variables, is_default) VALUES
('Bulletin Standard', 'Bulletin de notes semestriel standard', 'bulletin', 
'{"layout": "A4", "sections": ["header", "student_info", "grades", "footer"]}', 
'["student_name", "student_number", "academic_year", "issue_date"]', true),
('Relevé Officiel', 'Relevé de notes pour transferts et candidatures', 'transcript', 
'{"layout": "A4", "sections": ["header", "student_info", "detailed_grades", "certification", "footer"]}', 
'["student_name", "student_number", "program_name", "issue_date", "institution_name"]', true),
('Attestation Réussite', 'Certificat de validation d''un niveau', 'certificate', 
'{"layout": "A4", "sections": ["header", "certification_text", "validation", "footer"]}', 
'["student_name", "program_name", "academic_year", "issue_date", "institution_name"]', true);

-- Add updated_at trigger
CREATE TRIGGER update_document_templates_updated_at 
BEFORE UPDATE ON public.document_templates 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();

CREATE TRIGGER update_document_variables_updated_at 
BEFORE UPDATE ON public.document_variables 
FOR EACH ROW EXECUTE FUNCTION public.update_document_variables_updated_at();

CREATE TRIGGER update_document_requests_updated_at 
BEFORE UPDATE ON public.document_requests 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();