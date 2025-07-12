-- Phase 1: Renforcement Section 3 (Validation & Contrôle)
-- Créer les tables pour la validation avancée des notes

-- Table pour les règles de validation configurables
CREATE TABLE IF NOT EXISTS public.grade_validation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR NOT NULL,
  rule_type VARCHAR NOT NULL CHECK (rule_type IN ('range', 'format', 'consistency', 'mandatory', 'business')),
  conditions JSONB NOT NULL DEFAULT '{}',
  severity VARCHAR NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  academic_year_id UUID REFERENCES public.academic_years(id),
  program_id UUID REFERENCES public.programs(id),
  subject_id UUID REFERENCES public.subjects(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les alertes et anomalies détectées
CREATE TABLE IF NOT EXISTS public.grade_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  subject_id UUID REFERENCES public.subjects(id),
  grade_id UUID REFERENCES public.student_grades(id),
  alert_type VARCHAR NOT NULL,
  severity VARCHAR NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  rule_id UUID REFERENCES public.grade_validation_rules(id),
  status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'acknowledged', 'ignored')),
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour le workflow de validation multi-niveaux
CREATE TABLE IF NOT EXISTS public.grade_validation_workflow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id UUID NOT NULL REFERENCES public.student_grades(id),
  workflow_step INTEGER NOT NULL DEFAULT 1,
  validator_role VARCHAR NOT NULL,
  validator_id UUID REFERENCES public.profiles(id),
  validation_status VARCHAR NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected', 'skipped')),
  validation_date TIMESTAMP WITH TIME ZONE,
  comments TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 2: Optimisation Section 4 (Calculs automatiques)
-- Table pour les configurations de calcul ECTS
CREATE TABLE IF NOT EXISTS public.ects_calculation_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id),
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
  subject_id UUID REFERENCES public.subjects(id),
  ects_credits DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  coefficient DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  minimum_grade DECIMAL(4,2) DEFAULT 10.00,
  compensation_allowed BOOLEAN DEFAULT true,
  calculation_formula TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(program_id, academic_year_id, subject_id)
);

-- Table pour les simulations "what-if"
CREATE TABLE IF NOT EXISTS public.grade_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
  simulation_name VARCHAR NOT NULL,
  simulation_type VARCHAR NOT NULL DEFAULT 'what_if' CHECK (simulation_type IN ('what_if', 'projection', 'scenario')),
  original_data JSONB NOT NULL,
  simulated_data JSONB NOT NULL,
  results JSONB NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les mentions et récompenses automatiques
CREATE TABLE IF NOT EXISTS public.academic_honors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
  semester INTEGER,
  honor_type VARCHAR NOT NULL CHECK (honor_type IN ('mention', 'distinction', 'award', 'recognition')),
  honor_level VARCHAR NOT NULL,
  criteria_met JSONB NOT NULL,
  average_score DECIMAL(4,2),
  ects_earned DECIMAL(5,2),
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 3: Analytics & Insights avancées
-- Table pour les métriques de performance académique
CREATE TABLE IF NOT EXISTS public.academic_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type VARCHAR NOT NULL,
  metric_name VARCHAR NOT NULL,
  metric_value DECIMAL(10,4),
  academic_year_id UUID REFERENCES public.academic_years(id),
  program_id UUID REFERENCES public.programs(id),
  subject_id UUID REFERENCES public.subjects(id),
  calculation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les analyses prédictives IA
CREATE TABLE IF NOT EXISTS public.predictive_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  prediction_type VARCHAR NOT NULL CHECK (prediction_type IN ('success_rate', 'dropout_risk', 'performance_trend', 'recommendation')),
  prediction_score DECIMAL(5,4),
  confidence_level DECIMAL(5,4),
  contributing_factors JSONB,
  recommendations JSONB,
  model_version VARCHAR,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 4: Historique & Audit complet
-- Extension de la table audit_logs pour les opérations spécifiques
CREATE TABLE IF NOT EXISTS public.results_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type VARCHAR NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  session_id UUID,
  operation_details JSONB NOT NULL,
  before_data JSONB,
  after_data JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.grade_validation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_validation_workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ects_calculation_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_honors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for grade validation rules
CREATE POLICY "Teachers and admins can manage validation rules" ON public.grade_validation_rules
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create policies for grade alerts
CREATE POLICY "Users can view relevant alerts" ON public.grade_alerts
FOR SELECT USING (
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]) OR
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);

CREATE POLICY "Teachers and admins can manage alerts" ON public.grade_alerts
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create policies for validation workflow
CREATE POLICY "Validators can manage workflow" ON public.grade_validation_workflow
FOR ALL USING (
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]) OR
  validator_id = auth.uid()
);

-- Create policies for ECTS config
CREATE POLICY "Admins and teachers can manage ECTS config" ON public.ects_calculation_config
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create policies for simulations
CREATE POLICY "Users can view their simulations" ON public.grade_simulations
FOR SELECT USING (
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]) OR
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR
  created_by = auth.uid()
);

CREATE POLICY "Teachers and admins can create simulations" ON public.grade_simulations
FOR INSERT WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create policies for academic honors
CREATE POLICY "Users can view relevant honors" ON public.academic_honors
FOR SELECT USING (
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]) OR
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);

CREATE POLICY "System can manage honors" ON public.academic_honors
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create policies for performance metrics
CREATE POLICY "Authenticated users can view metrics" ON public.academic_performance_metrics
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and teachers can manage metrics" ON public.academic_performance_metrics
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create policies for predictive analytics
CREATE POLICY "Users can view relevant predictions" ON public.predictive_analytics
FOR SELECT USING (
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]) OR
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
);

CREATE POLICY "Admins and teachers can manage predictions" ON public.predictive_analytics
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create policies for audit logs
CREATE POLICY "Admins can view audit logs" ON public.results_audit_logs
FOR SELECT USING (get_current_user_role() = 'admin'::user_role);

CREATE POLICY "System can create audit logs" ON public.results_audit_logs
FOR INSERT WITH CHECK (true);

-- Create functions for advanced calculations
CREATE OR REPLACE FUNCTION public.calculate_ects_with_compensation(
  p_student_id UUID,
  p_academic_year_id UUID,
  p_semester INTEGER DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB := '{}';
  v_total_ects DECIMAL := 0;
  v_earned_ects DECIMAL := 0;
  v_compensation_applied BOOLEAN := false;
BEGIN
  -- Calculate ECTS with compensation logic
  SELECT 
    COALESCE(SUM(ecc.ects_credits), 0) as total,
    COALESCE(SUM(CASE 
      WHEN sg.grade >= ecc.minimum_grade THEN ecc.ects_credits
      WHEN ecc.compensation_allowed AND sg.grade >= (ecc.minimum_grade - 2) THEN ecc.ects_credits * 0.5
      ELSE 0
    END), 0) as earned
  INTO v_total_ects, v_earned_ects
  FROM public.student_grades sg
  JOIN public.ects_calculation_config ecc ON ecc.subject_id = sg.subject_id 
    AND ecc.academic_year_id = sg.academic_year_id
  WHERE sg.student_id = p_student_id 
    AND sg.academic_year_id = p_academic_year_id
    AND (p_semester IS NULL OR sg.semester = p_semester)
    AND sg.is_published = true;
  
  v_result := jsonb_build_object(
    'student_id', p_student_id,
    'academic_year_id', p_academic_year_id,
    'semester', p_semester,
    'total_ects', v_total_ects,
    'earned_ects', v_earned_ects,
    'completion_rate', CASE WHEN v_total_ects > 0 THEN (v_earned_ects / v_total_ects * 100) ELSE 0 END,
    'calculated_at', now()
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for grade validation
CREATE OR REPLACE FUNCTION public.validate_grade_with_rules(
  p_student_id UUID,
  p_subject_id UUID,
  p_grade DECIMAL,
  p_evaluation_type_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_errors TEXT[] := '{}';
  v_warnings TEXT[] := '{}';
  v_valid BOOLEAN := true;
  v_rule RECORD;
BEGIN
  -- Apply validation rules
  FOR v_rule IN 
    SELECT * FROM public.grade_validation_rules 
    WHERE is_active = true 
      AND (subject_id IS NULL OR subject_id = p_subject_id)
  LOOP
    -- Check range rules
    IF v_rule.rule_type = 'range' THEN
      IF p_grade < (v_rule.conditions->>'min_value')::DECIMAL OR 
         p_grade > (v_rule.conditions->>'max_value')::DECIMAL THEN
        IF v_rule.severity = 'error' THEN
          v_errors := array_append(v_errors, v_rule.rule_name);
          v_valid := false;
        ELSE
          v_warnings := array_append(v_warnings, v_rule.rule_name);
        END IF;
      END IF;
    END IF;
    
    -- Add other rule types as needed
  END LOOP;
  
  RETURN jsonb_build_object(
    'valid', v_valid,
    'errors', to_jsonb(v_errors),
    'warnings', to_jsonb(v_warnings),
    'validated_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for predictive analytics
CREATE OR REPLACE FUNCTION public.calculate_dropout_risk_score(
  p_student_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_risk_score DECIMAL := 0;
  v_avg_grade DECIMAL;
  v_attendance_rate DECIMAL;
  v_grade_trend DECIMAL;
BEGIN
  -- Calculate average grade
  SELECT AVG(grade) INTO v_avg_grade
  FROM public.student_grades 
  WHERE student_id = p_student_id AND is_published = true;
  
  -- Calculate attendance rate
  SELECT 
    (COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / COUNT(*)) * 100
  INTO v_attendance_rate
  FROM public.attendance_records 
  WHERE student_id = p_student_id;
  
  -- Simple risk calculation (to be enhanced with ML models)
  v_risk_score := CASE
    WHEN v_avg_grade < 10 THEN 0.8
    WHEN v_avg_grade < 12 THEN 0.5
    WHEN v_avg_grade < 14 THEN 0.3
    ELSE 0.1
  END;
  
  -- Adjust based on attendance
  IF v_attendance_rate < 80 THEN
    v_risk_score := v_risk_score + 0.2;
  END IF;
  
  RETURN LEAST(v_risk_score, 1.0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_grade_alerts_student_status ON public.grade_alerts(student_id, status);
CREATE INDEX IF NOT EXISTS idx_grade_validation_workflow_grade ON public.grade_validation_workflow(grade_id);
CREATE INDEX IF NOT EXISTS idx_ects_config_program_year ON public.ects_calculation_config(program_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_academic_honors_student_year ON public.academic_honors(student_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type_date ON public.academic_performance_metrics(metric_type, calculation_date);
CREATE INDEX IF NOT EXISTS idx_predictive_analytics_student_type ON public.predictive_analytics(student_id, prediction_type);
CREATE INDEX IF NOT EXISTS idx_results_audit_entity ON public.results_audit_logs(entity_type, entity_id);

-- Insert some default validation rules
INSERT INTO public.grade_validation_rules (rule_name, rule_type, conditions, severity) VALUES
('Grade Range Check', 'range', '{"min_value": 0, "max_value": 20}', 'error'),
('Low Grade Alert', 'range', '{"min_value": 0, "max_value": 8}', 'warning'),
('Exceptional Grade Alert', 'range', '{"min_value": 18, "max_value": 20}', 'info');

-- Insert ECTS configuration for common programs
INSERT INTO public.ects_calculation_config (program_id, academic_year_id, ects_credits, coefficient)
SELECT p.id, ay.id, 6.0, 1.0
FROM public.programs p
CROSS JOIN public.academic_years ay
WHERE ay.is_current = true
ON CONFLICT DO NOTHING;