-- First ensure we have the document_types table
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

-- Now update document_templates table to match our interface
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS code;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS template_type;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS template_content;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS category_id;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS program_id;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS level_id;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS academic_year_id;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS requires_approval;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS auto_generate;
ALTER TABLE public.document_templates DROP COLUMN IF EXISTS target_audience;

-- Add columns to match our interface
ALTER TABLE public.document_templates ADD COLUMN IF NOT EXISTS document_type_id UUID REFERENCES public.document_types(id) ON DELETE CASCADE;
ALTER TABLE public.document_templates ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.document_templates ADD COLUMN IF NOT EXISTS preview_url TEXT;
ALTER TABLE public.document_templates ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.document_templates ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Create sections table for section-based template editing
CREATE TABLE IF NOT EXISTS public.template_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.document_templates(id) ON DELETE CASCADE,
  section_type VARCHAR NOT NULL, -- 'header', 'content', 'footer'
  section_name VARCHAR NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  styles JSONB NOT NULL DEFAULT '{}'::jsonb,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sections ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for template_sections
CREATE POLICY "Users can view template sections"
  ON public.template_sections FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage template sections"
  ON public.template_sections FOR ALL
  USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_types_category ON public.document_types(category);
CREATE INDEX IF NOT EXISTS idx_document_types_is_active ON public.document_types(is_active);
CREATE INDEX IF NOT EXISTS idx_document_templates_type_id ON public.document_templates(document_type_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_is_default ON public.document_templates(is_default);
CREATE INDEX IF NOT EXISTS idx_template_sections_template_id ON public.template_sections(template_id);
CREATE INDEX IF NOT EXISTS idx_template_sections_section_type ON public.template_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_template_sections_order ON public.template_sections(template_id, order_index);

-- Create trigger for updated_at
CREATE TRIGGER update_document_types_updated_at 
    BEFORE UPDATE ON public.document_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at 
    BEFORE UPDATE ON public.document_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_sections_updated_at 
    BEFORE UPDATE ON public.template_sections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO public.document_types (name, code, description, category, color, variables) VALUES
('Bulletin de Notes', 'BULLETIN', 'Bulletin semestriel avec notes et moyennes', 'academique', 'blue', '["student_name", "student_number", "program", "semester", "grades"]'),
('Relevé de Notes', 'RELEVE', 'Relevé détaillé des notes', 'academique', 'green', '["student_name", "student_number", "program", "all_grades", "gpa"]'),
('Attestation de Scolarité', 'ATTESTATION', 'Certificat de scolarité officiel', 'officiel', 'purple', '["student_name", "student_number", "program", "enrollment_date", "current_year"]'),
('Certificat de Réussite', 'CERTIFICAT', 'Certificat de réussite aux examens', 'officiel', 'yellow', '["student_name", "student_number", "program", "graduation_date", "honors"]')
ON CONFLICT (code) DO NOTHING;