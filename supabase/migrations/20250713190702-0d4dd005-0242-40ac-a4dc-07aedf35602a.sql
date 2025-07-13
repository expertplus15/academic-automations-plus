-- Create document_templates table
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    template_type VARCHAR NOT NULL CHECK (template_type IN ('bulletin', 'transcript', 'certificate', 'attestation')),
    template_content JSONB NOT NULL DEFAULT '{}',
    html_template TEXT,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create generated_documents table  
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.document_templates(id),
    student_id UUID REFERENCES public.students(id),
    document_number VARCHAR NOT NULL,
    file_path TEXT,
    download_url TEXT,
    generation_data JSONB DEFAULT '{}',
    is_valid BOOLEAN DEFAULT true,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    signed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample document templates
INSERT INTO public.document_templates (name, template_type, template_content, html_template, variables, is_default) VALUES
('Bulletin Standard', 'bulletin', '{"layout": "standard", "sections": ["header", "grades", "footer"]}', 
'<div class="bulletin"><h1>Bulletin de Notes</h1><p>Étudiant: {{student_name}}</p><p>Période: {{period}}</p><div class="grades">{{grades_table}}</div></div>',
'["student_name", "period", "grades_table"]', true),

('Relevé Officiel', 'transcript', '{"layout": "official", "sections": ["header", "subjects", "signature"]}',
'<div class="transcript"><h1>Relevé de Notes Officiel</h1><p>Nom: {{student_name}}</p><p>Programme: {{program_name}}</p><div class="subjects">{{subjects_list}}</div></div>',
'["student_name", "program_name", "subjects_list"]', true),

('Certificat de Scolarité', 'certificate', '{"layout": "formal", "sections": ["header", "certification", "signature"]}',
'<div class="certificate"><h1>Certificat de Scolarité</h1><p>Nous certifions que {{student_name}} est inscrit(e) dans notre établissement.</p><p>Année académique: {{academic_year}}</p></div>',
'["student_name", "academic_year"]', true),

('Attestation de Réussite', 'attestation', '{"layout": "simple", "sections": ["header", "attestation", "signature"]}',
'<div class="attestation"><h1>Attestation de Réussite</h1><p>{{student_name}} a réussi avec succès {{course_name}}.</p><p>Note obtenue: {{final_grade}}/20</p></div>',
'["student_name", "course_name", "final_grade"]', true);

-- Enable RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_templates
CREATE POLICY "Staff can manage document templates" ON public.document_templates
    FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'teacher'::user_role]));

CREATE POLICY "Anyone can view active templates" ON public.document_templates
    FOR SELECT USING (is_active = true);

-- Create RLS policies for generated_documents  
CREATE POLICY "Staff can manage generated documents" ON public.generated_documents
    FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'teacher'::user_role]));

CREATE POLICY "Students can view their own documents" ON public.generated_documents
    FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
        get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'teacher'::user_role])
    );

-- Create indexes for better performance
CREATE INDEX idx_document_templates_type ON public.document_templates(template_type);
CREATE INDEX idx_document_templates_active ON public.document_templates(is_active);
CREATE INDEX idx_generated_documents_student ON public.generated_documents(student_id);
CREATE INDEX idx_generated_documents_template ON public.generated_documents(template_id);