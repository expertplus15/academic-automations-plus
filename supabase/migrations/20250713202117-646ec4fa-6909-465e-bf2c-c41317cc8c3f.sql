-- Add academic relationships to document templates
ALTER TABLE public.document_templates 
ADD COLUMN program_id uuid REFERENCES public.programs(id),
ADD COLUMN level_id uuid REFERENCES public.academic_levels(id),
ADD COLUMN academic_year_id uuid REFERENCES public.academic_years(id),
ADD COLUMN variables jsonb DEFAULT '[]'::jsonb,
ADD COLUMN auto_generate boolean DEFAULT false,
ADD COLUMN target_audience jsonb DEFAULT '[]'::jsonb;

-- Update generated documents to include academic context
ALTER TABLE public.generated_documents
ADD COLUMN academic_year_id uuid REFERENCES public.academic_years(id),
ADD COLUMN semester integer,
ADD COLUMN program_id uuid REFERENCES public.programs(id);

-- Create a table for document variable definitions
CREATE TABLE public.document_variables (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name character varying NOT NULL,
  label character varying NOT NULL,
  variable_type character varying NOT NULL DEFAULT 'text',
  source_table character varying,
  source_field character varying,
  calculation_type character varying,
  default_value text,
  is_required boolean DEFAULT false,
  description text,
  category character varying DEFAULT 'student',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert standard academic document variables
INSERT INTO public.document_variables (name, label, variable_type, source_table, source_field, category, description) VALUES
-- Student variables
('student.full_name', 'Nom complet', 'text', 'profiles', 'full_name', 'student', 'Nom complet de l''étudiant'),
('student.student_number', 'Numéro étudiant', 'text', 'students', 'student_number', 'student', 'Numéro d''identification étudiant'),
('student.email', 'Email', 'text', 'profiles', 'email', 'student', 'Adresse email de l''étudiant'),
('student.enrollment_date', 'Date d''inscription', 'date', 'students', 'enrollment_date', 'student', 'Date d''inscription de l''étudiant'),
('student.year_level', 'Niveau d''étude', 'number', 'students', 'year_level', 'student', 'Niveau d''étude actuel'),

-- Program variables
('program.name', 'Nom du programme', 'text', 'programs', 'name', 'program', 'Nom du programme d''étude'),
('program.code', 'Code programme', 'text', 'programs', 'code', 'program', 'Code du programme'),
('program.duration_years', 'Durée du programme', 'number', 'programs', 'duration_years', 'program', 'Durée en années du programme'),

-- Academic year variables
('academic_year.name', 'Année académique', 'text', 'academic_years', 'name', 'academic', 'Nom de l''année académique'),
('academic_year.start_date', 'Date de début', 'date', 'academic_years', 'start_date', 'academic', 'Date de début de l''année académique'),
('academic_year.end_date', 'Date de fin', 'date', 'academic_years', 'end_date', 'academic', 'Date de fin de l''année académique'),

-- Calculated variables
('grades.overall_average', 'Moyenne générale', 'calculated', NULL, NULL, 'grades', 'Moyenne générale des notes'),
('grades.semester_average', 'Moyenne semestrielle', 'calculated', NULL, NULL, 'grades', 'Moyenne du semestre'),
('attendance.rate', 'Taux de présence', 'calculated', NULL, NULL, 'attendance', 'Pourcentage de présence'),
('ects.earned', 'Crédits ECTS acquis', 'calculated', NULL, NULL, 'ects', 'Nombre de crédits ECTS validés'),
('ects.total', 'Crédits ECTS totaux', 'calculated', NULL, NULL, 'ects', 'Nombre total de crédits ECTS'),

-- Institution variables
('institution.name', 'Nom de l''établissement', 'text', 'system_settings', 'institution_name', 'institution', 'Nom de l''établissement'),
('institution.address', 'Adresse', 'text', 'system_settings', 'institution_address', 'institution', 'Adresse de l''établissement'),
('document.issue_date', 'Date d''émission', 'date', NULL, NULL, 'document', 'Date d''émission du document'),
('document.number', 'Numéro de document', 'text', NULL, NULL, 'document', 'Numéro unique du document');

-- Enable RLS on document_variables
ALTER TABLE public.document_variables ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_variables
CREATE POLICY "Staff can manage document variables" 
ON public.document_variables 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role, 'teacher'::user_role]));

CREATE POLICY "Anyone can view document variables" 
ON public.document_variables 
FOR SELECT 
USING (true);

-- Update sample templates with academic data
UPDATE public.document_templates 
SET 
  variables = '[
    "student.full_name",
    "student.student_number", 
    "program.name",
    "academic_year.name",
    "institution.name",
    "document.issue_date"
  ]'::jsonb,
  target_audience = '["students"]'::jsonb
WHERE template_type = 'certificate';

UPDATE public.document_templates 
SET 
  variables = '[
    "student.full_name",
    "student.student_number",
    "program.name", 
    "grades.overall_average",
    "grades.semester_average",
    "ects.earned",
    "academic_year.name",
    "institution.name",
    "document.issue_date"
  ]'::jsonb,
  target_audience = '["students", "administration"]'::jsonb
WHERE template_type = 'transcript';

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_document_variables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_document_variables_updated_at
BEFORE UPDATE ON public.document_variables
FOR EACH ROW
EXECUTE FUNCTION public.update_document_variables_updated_at();

-- Create function to get available variables for a template type
CREATE OR REPLACE FUNCTION public.get_template_variables(p_template_type text DEFAULT NULL, p_category text DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  name character varying,
  label character varying,
  variable_type character varying,
  category character varying,
  description text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dv.id,
    dv.name,
    dv.label,
    dv.variable_type,
    dv.category,
    dv.description
  FROM public.document_variables dv
  WHERE (p_category IS NULL OR dv.category = p_category)
  ORDER BY dv.category, dv.label;
END;
$$;