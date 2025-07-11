-- Table des catégories de documents
CREATE TABLE IF NOT EXISTS public.document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#007bff',
    icon VARCHAR(50),
    parent_id UUID REFERENCES public.document_categories(id),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des workflows de signature
CREATE TABLE IF NOT EXISTS public.signature_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des signatures électroniques
CREATE TABLE IF NOT EXISTS public.document_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.generated_documents(id) ON DELETE CASCADE,
    signer_id UUID NOT NULL REFERENCES auth.users(id),
    workflow_id UUID REFERENCES public.signature_workflows(id),
    signature_order INT NOT NULL DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'rejected')),
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_data TEXT,
    comments TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des sources de données
CREATE TABLE IF NOT EXISTS public.data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('database', 'api', 'file')),
    connection_string TEXT,
    configuration JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS public.system_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des logs d'audit
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mettre à jour la table document_templates pour inclure category_id
ALTER TABLE public.document_templates 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.document_categories(id);

-- Ajouter des index pour les performances
CREATE INDEX IF NOT EXISTS idx_document_categories_parent ON public.document_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_document_signatures_document ON public.document_signatures(document_id);
CREATE INDEX IF NOT EXISTS idx_document_signatures_signer ON public.document_signatures(signer_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_user ON public.system_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);

-- Triggers pour updated_at
CREATE OR REPLACE TRIGGER update_document_categories_updated_at
    BEFORE UPDATE ON public.document_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_signature_workflows_updated_at
    BEFORE UPDATE ON public.signature_workflows
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_document_signatures_updated_at
    BEFORE UPDATE ON public.document_signatures
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_data_sources_updated_at
    BEFORE UPDATE ON public.data_sources
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Politiques RLS
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signature_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Politiques pour document_categories
CREATE POLICY "Anyone can view active categories" ON public.document_categories
    FOR SELECT USING (is_active = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Staff can manage categories" ON public.document_categories
    FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques pour signature_workflows
CREATE POLICY "Staff can manage workflows" ON public.signature_workflows
    FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques pour document_signatures
CREATE POLICY "Users can view their signatures" ON public.document_signatures
    FOR SELECT USING (
        signer_id = auth.uid() OR 
        document_id IN (
            SELECT gd.id FROM generated_documents gd 
            JOIN document_requests dr ON gd.request_id = dr.id 
            WHERE dr.student_id IN (
                SELECT s.id FROM students s WHERE s.profile_id = auth.uid()
            )
        ) OR 
        get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role])
    );

CREATE POLICY "Users can sign their documents" ON public.document_signatures
    FOR UPDATE USING (signer_id = auth.uid() AND status = 'pending');

CREATE POLICY "Staff can manage signatures" ON public.document_signatures
    FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques pour data_sources
CREATE POLICY "Staff can manage data sources" ON public.data_sources
    FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques pour system_notifications
CREATE POLICY "Users can view their notifications" ON public.system_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.system_notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.system_notifications
    FOR INSERT WITH CHECK (true);

-- Politiques pour audit_logs
CREATE POLICY "Staff can view audit logs" ON public.audit_logs
    FOR SELECT USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "System can create audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Insérer quelques catégories par défaut
INSERT INTO public.document_categories (name, description, color, icon, sort_order) VALUES
('Certificats', 'Certificats de scolarité et attestations', '#007bff', 'award', 1),
('Relevés', 'Relevés de notes et bulletins', '#28a745', 'file-text', 2),
('Administratif', 'Documents administratifs divers', '#ffc107', 'folder', 3),
('Diplômes', 'Diplômes et certifications', '#dc3545', 'graduation-cap', 4),
('Stages', 'Conventions et rapports de stage', '#17a2b8', 'briefcase', 5),
('Assurance', 'Documents d\'assurance', '#6f42c1', 'shield', 6)
ON CONFLICT DO NOTHING;