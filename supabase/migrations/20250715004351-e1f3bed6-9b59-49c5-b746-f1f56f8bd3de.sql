-- Create grading systems configuration table
CREATE TABLE public.grading_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  academic_year_id UUID REFERENCES public.academic_years(id),
  default_scale DECIMAL(4,2) DEFAULT 20.00,
  passing_grade DECIMAL(4,2) DEFAULT 10.00,
  decimal_places INTEGER DEFAULT 2,
  rounding_method VARCHAR DEFAULT 'mathematical', -- mathematical, up, down
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create grading rules for weighting and compensation
CREATE TABLE public.grading_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grading_system_id UUID REFERENCES public.grading_systems(id) ON DELETE CASCADE,
  rule_type VARCHAR NOT NULL, -- weighting, compensation, progression
  subject_type VARCHAR, -- fundamental, complementary, project
  rule_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create grade scales and mentions
CREATE TABLE public.grade_scales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grading_system_id UUID REFERENCES public.grading_systems(id) ON DELETE CASCADE,
  min_grade DECIMAL(4,2) NOT NULL,
  max_grade DECIMAL(4,2) NOT NULL,
  mention_label VARCHAR NOT NULL,
  mention_color VARCHAR DEFAULT '#9e9e9e',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create calculation formulas table
CREATE TABLE public.calculation_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grading_system_id UUID REFERENCES public.grading_systems(id) ON DELETE CASCADE,
  formula_type VARCHAR NOT NULL, -- subject_average, weighted_total, general_average
  formula_expression TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.grading_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_formulas ENABLE ROW LEVEL SECURITY;

-- Admins can manage grading systems
CREATE POLICY "Admins can manage grading systems" ON public.grading_systems
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can view grading systems" ON public.grading_systems
  FOR SELECT USING (is_active = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Similar policies for other tables
CREATE POLICY "Admins can manage grading rules" ON public.grading_rules
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can view grading rules" ON public.grading_rules
  FOR SELECT USING (is_active = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Admins can manage grade scales" ON public.grade_scales
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can view grade scales" ON public.grade_scales
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage calculation formulas" ON public.calculation_formulas
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can view calculation formulas" ON public.calculation_formulas
  FOR SELECT USING (is_active = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Insert default grading system data
INSERT INTO public.grading_systems (name, default_scale, passing_grade, decimal_places, rounding_method, is_active) 
VALUES ('Système Standard Français', 20.00, 10.00, 2, 'mathematical', true);

-- Get the inserted grading system ID
DO $$
DECLARE
    system_id UUID;
BEGIN
    SELECT id INTO system_id FROM public.grading_systems WHERE name = 'Système Standard Français';
    
    -- Insert default grading rules
    INSERT INTO public.grading_rules (grading_system_id, rule_type, subject_type, rule_config) VALUES
    (system_id, 'weighting', 'fundamental', '{"cc": 0.4, "examen": 0.6}'),
    (system_id, 'weighting', 'complementary', '{"cc": 0.5, "examen": 0.5}'),
    (system_id, 'weighting', 'project', '{"cc": 0.7, "examen": 0.3}'),
    (system_id, 'compensation', 'general', '{"active": true, "min_compensable": 7, "type": "inter-semester"}');
    
    -- Insert default grade scales (mentions)
    INSERT INTO public.grade_scales (grading_system_id, min_grade, max_grade, mention_label, mention_color, display_order) VALUES
    (system_id, 16.00, 20.00, 'Très Bien', '#4caf50', 1),
    (system_id, 14.00, 15.99, 'Bien', '#2196f3', 2),
    (system_id, 12.00, 13.99, 'Assez Bien', '#ff9800', 3),
    (system_id, 10.00, 11.99, 'Passable', '#9e9e9e', 4),
    (system_id, 0.00, 9.99, 'Ajourné', '#f44336', 5);
    
    -- Insert default calculation formulas
    INSERT INTO public.calculation_formulas (grading_system_id, formula_type, formula_expression, parameters) VALUES
    (system_id, 'subject_average', '(CC × pondCC) + (Examen × pondExamen)', '{"variables": ["CC", "Examen", "pondCC", "pondExamen"]}'),
    (system_id, 'weighted_total', 'moyenneMatiere × coefficient', '{"variables": ["moyenneMatiere", "coefficient"]}'),
    (system_id, 'general_average', 'Σ(totalPondere) / Σ(coefficients)', '{"variables": ["totalPondere", "coefficients"]}');
END $$;