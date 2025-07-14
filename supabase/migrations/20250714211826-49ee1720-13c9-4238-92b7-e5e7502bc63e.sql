-- Update document_templates table to match our interface
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
ALTER TABLE public.document_templates ADD COLUMN IF NOT EXISTS document_type_id UUID NOT NULL REFERENCES public.document_types(id) ON DELETE CASCADE;
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
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sections ENABLE ROW LEVEL SECURITY;

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
CREATE INDEX IF NOT EXISTS idx_template_sections_template_id ON public.template_sections(template_id);
CREATE INDEX IF NOT EXISTS idx_template_sections_section_type ON public.template_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_template_sections_order ON public.template_sections(template_id, order_index);

-- Create trigger for updated_at
CREATE TRIGGER update_template_sections_updated_at 
    BEFORE UPDATE ON public.template_sections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();