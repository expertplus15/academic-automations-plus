-- Create document_types table
CREATE TABLE IF NOT EXISTS public.document_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR DEFAULT 'FileText',
  color VARCHAR DEFAULT 'blue',
  category VARCHAR NOT NULL DEFAULT 'academique',
  variables JSONB DEFAULT '[]'::jsonb,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document_templates table  
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  document_type_id UUID NOT NULL REFERENCES public.document_types(id) ON DELETE CASCADE,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  variables JSONB NOT NULL DEFAULT '{}'::jsonb,
  preview_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_types_category ON public.document_types(category);
CREATE INDEX IF NOT EXISTS idx_document_types_is_active ON public.document_types(is_active);
CREATE INDEX IF NOT EXISTS idx_document_templates_type_id ON public.document_templates(document_type_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_is_default ON public.document_templates(is_default);

-- Enable RLS
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_types
CREATE POLICY "Users can view document types"
  ON public.document_types FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage document types"
  ON public.document_types FOR ALL
  USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create RLS policies for document_templates  
CREATE POLICY "Users can view document templates"
  ON public.document_templates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage document templates"
  ON public.document_templates FOR ALL
  USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_document_types_updated_at 
    BEFORE UPDATE ON public.document_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at 
    BEFORE UPDATE ON public.document_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO public.document_types (name, code, description, category, color, variables) VALUES
('Bulletin de Notes', 'BULLETIN', 'Bulletin semestriel avec notes et moyennes', 'academique', 'blue', '["student_name", "student_number", "program", "semester", "grades"]'),
('Relevé de Notes', 'RELEVE', 'Relevé détaillé des notes', 'academique', 'green', '["student_name", "student_number", "program", "all_grades", "gpa"]'),
('Attestation de Scolarité', 'ATTESTATION', 'Certificat de scolarité officiel', 'officiel', 'purple', '["student_name", "student_number", "program", "enrollment_date", "current_year"]'),
('Certificat de Réussite', 'CERTIFICAT', 'Certificat de réussite aux examens', 'officiel', 'yellow', '["student_name", "student_number", "program", "graduation_date", "honors"]')
ON CONFLICT (code) DO NOTHING;