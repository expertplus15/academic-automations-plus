-- 2. Function to validate grade entries
CREATE OR REPLACE FUNCTION public.validate_grade_entry(
  p_student_id UUID,
  p_subject_id UUID,
  p_evaluation_type_id UUID,
  p_grade DECIMAL,
  p_max_grade DECIMAL DEFAULT 20.00
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_errors TEXT[] := '{}';
  v_warnings TEXT[] := '{}';
  v_valid BOOLEAN := true;
BEGIN
  -- Check if grade is within valid range
  IF p_grade < 0 OR p_grade > p_max_grade THEN
    v_errors := array_append(v_errors, 'Note doit être entre 0 et ' || p_max_grade);
    v_valid := false;
  END IF;
  
  -- Check if student exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.students 
    WHERE id = p_student_id AND status = 'active'
  ) THEN
    v_errors := array_append(v_errors, 'Etudiant non trouve ou inactif');
    v_valid := false;
  END IF;
  
  -- Check if subject exists
  IF NOT EXISTS (
    SELECT 1 FROM public.subjects WHERE id = p_subject_id
  ) THEN
    v_errors := array_append(v_errors, 'Matière non trouvee');
    v_valid := false;
  END IF;
  
  -- Check if evaluation type exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.evaluation_types 
    WHERE id = p_evaluation_type_id AND is_active = true
  ) THEN
    v_errors := array_append(v_errors, 'Type evaluation non trouve ou inactif');
    v_valid := false;
  END IF;
  
  -- Warning for very low grades
  IF p_grade < (p_max_grade * 0.3) THEN
    v_warnings := array_append(v_warnings, 'Note particulièrement basse - Verifier la saisie');
  END IF;
  
  -- Warning for duplicate entries
  IF EXISTS (
    SELECT 1 FROM public.student_grades
    WHERE student_id = p_student_id 
      AND subject_id = p_subject_id
      AND evaluation_type_id = p_evaluation_type_id
  ) THEN
    v_warnings := array_append(v_warnings, 'Une note existe deja pour cette evaluation');
  END IF;
  
  RETURN jsonb_build_object(
    'valid', v_valid,
    'errors', to_jsonb(v_errors),
    'warnings', to_jsonb(v_warnings),
    'validated_at', now()
  );
END;
$$;