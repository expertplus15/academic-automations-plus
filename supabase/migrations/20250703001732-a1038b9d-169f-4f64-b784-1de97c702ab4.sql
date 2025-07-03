-- Phase 1A: Evaluation Module Foundation
-- Backend functions for grades, calculations, and student transcripts

-- 1. Function to calculate student averages automatically
CREATE OR REPLACE FUNCTION public.calculate_student_averages(
  p_student_id UUID, 
  p_academic_year_id UUID, 
  p_semester INTEGER DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subject_averages JSONB := '{}';
  v_overall_average DECIMAL(5,2);
  v_subject RECORD;
  v_weighted_sum DECIMAL := 0;
  v_total_weight DECIMAL := 0;
BEGIN
  -- Calculate average for each subject
  FOR v_subject IN 
    SELECT DISTINCT sg.subject_id, s.name as subject_name, s.credits_ects
    FROM public.student_grades sg
    JOIN public.subjects s ON s.id = sg.subject_id
    WHERE sg.student_id = p_student_id 
      AND sg.academic_year_id = p_academic_year_id
      AND (p_semester IS NULL OR sg.semester = p_semester)
      AND sg.is_published = true
  LOOP
    -- Calculate weighted average for this subject
    WITH subject_avg AS (
      SELECT 
        SUM(sg.grade * et.weight_percentage / 100.0) / SUM(et.weight_percentage / 100.0) as avg_grade
      FROM public.student_grades sg
      JOIN public.evaluation_types et ON et.id = sg.evaluation_type_id
      WHERE sg.student_id = p_student_id
        AND sg.subject_id = v_subject.subject_id
        AND sg.academic_year_id = p_academic_year_id
        AND (p_semester IS NULL OR sg.semester = p_semester)
        AND sg.is_published = true
        AND et.is_active = true
    )
    SELECT avg_grade INTO v_subject_averages
    FROM subject_avg;
    
    -- Add to overall calculation
    IF v_subject_averages IS NOT NULL THEN
      v_weighted_sum := v_weighted_sum + (v_subject_averages::decimal * COALESCE(v_subject.credits_ects, 1));
      v_total_weight := v_total_weight + COALESCE(v_subject.credits_ects, 1);
      
      -- Store subject average
      v_subject_averages := jsonb_set(
        v_subject_averages,
        ARRAY[v_subject.subject_id::text],
        to_jsonb(v_subject_averages::decimal)
      );
    END IF;
  END LOOP;
  
  -- Calculate overall average
  IF v_total_weight > 0 THEN
    v_overall_average := v_weighted_sum / v_total_weight;
  END IF;
  
  -- Return comprehensive results
  RETURN jsonb_build_object(
    'student_id', p_student_id,
    'academic_year_id', p_academic_year_id,
    'semester', p_semester,
    'subject_averages', v_subject_averages,
    'overall_average', v_overall_average,
    'total_credits', v_total_weight,
    'calculated_at', now()
  );
END;
$$;

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
    v_errors := array_append(v_errors, 'Étudiant non trouvé ou inactif');
    v_valid := false;
  END IF;
  
  -- Check if subject exists
  IF NOT EXISTS (
    SELECT 1 FROM public.subjects WHERE id = p_subject_id
  ) THEN
    v_errors := array_append(v_errors, 'Matière non trouvée');
    v_valid := false;
  END IF;
  
  -- Check if evaluation type exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.evaluation_types 
    WHERE id = p_evaluation_type_id AND is_active = true
  ) THEN
    v_errors := array_append(v_errors, 'Type d\'évaluation non trouvé ou inactif');
    v_valid := false;
  END IF;
  
  -- Warning for very low grades
  IF p_grade < (p_max_grade * 0.3) THEN
    v_warnings := array_append(v_warnings, 'Note particulièrement basse - Vérifier la saisie');
  END IF;
  
  -- Warning for duplicate entries
  IF EXISTS (
    SELECT 1 FROM public.student_grades
    WHERE student_id = p_student_id 
      AND subject_id = p_subject_id
      AND evaluation_type_id = p_evaluation_type_id
  ) THEN
    v_warnings := array_append(v_warnings, 'Une note existe déjà pour cette évaluation');
  END IF;
  
  RETURN jsonb_build_object(
    'valid', v_valid,
    'errors', to_jsonb(v_errors),
    'warnings', to_jsonb(v_warnings),
    'validated_at', now()
  );
END;
$$;

-- 3. Function to generate student transcript data
CREATE OR REPLACE FUNCTION public.generate_student_transcript(
  p_student_id UUID,
  p_academic_year_id UUID
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_student_info JSONB;
  v_grades_data JSONB := '[]';
  v_semester_data JSONB := '{}';
  v_overall_stats JSONB;
  v_semester INTEGER;
BEGIN
  -- Get student information
  SELECT jsonb_build_object(
    'id', s.id,
    'student_number', s.student_number,
    'full_name', p.full_name,
    'email', p.email,
    'program_name', pr.name,
    'level_name', al.name,
    'enrollment_date', s.enrollment_date
  ) INTO v_student_info
  FROM public.students s
  JOIN public.profiles p ON p.id = s.profile_id
  LEFT JOIN public.programs pr ON pr.id = s.program_id
  LEFT JOIN public.academic_levels al ON al.id = s.level_id
  WHERE s.id = p_student_id;
  
  -- Process each semester
  FOR v_semester IN 
    SELECT DISTINCT semester 
    FROM public.student_grades 
    WHERE student_id = p_student_id 
      AND academic_year_id = p_academic_year_id
      AND is_published = true
    ORDER BY semester
  LOOP
    -- Get semester calculations
    SELECT public.calculate_student_averages(p_student_id, p_academic_year_id, v_semester)
    INTO v_semester_data;
    
    -- Add semester data
    v_grades_data := jsonb_set(
      v_grades_data,
      ARRAY['semester_' || v_semester::text],
      v_semester_data
    );
  END LOOP;
  
  -- Get overall statistics
  SELECT public.calculate_student_averages(p_student_id, p_academic_year_id, NULL)
  INTO v_overall_stats;
  
  RETURN jsonb_build_object(
    'student_info', v_student_info,
    'academic_year_id', p_academic_year_id,
    'grades_by_semester', v_grades_data,
    'overall_statistics', v_overall_stats,
    'generated_at', now(),
    'total_semesters', jsonb_array_length(v_grades_data)
  );
END;
$$;

-- 4. Function to auto-calculate and update student progress
CREATE OR REPLACE FUNCTION public.update_student_progress_from_grades()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_calculations JSONB;
BEGIN
  -- Trigger calculations when grades are inserted/updated
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Calculate averages for this student
    SELECT public.calculate_student_averages(
      NEW.student_id, 
      NEW.academic_year_id, 
      NEW.semester
    ) INTO v_calculations;
    
    -- Update student_progress table
    INSERT INTO public.student_progress (
      student_id, academic_year_id, semester,
      overall_average, last_calculated_at
    ) VALUES (
      NEW.student_id, NEW.academic_year_id, NEW.semester,
      (v_calculations->>'overall_average')::decimal,
      now()
    )
    ON CONFLICT (student_id, academic_year_id, semester) 
    DO UPDATE SET
      overall_average = (v_calculations->>'overall_average')::decimal,
      last_calculated_at = now();
      
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger for automatic calculations
DROP TRIGGER IF EXISTS trigger_update_student_progress ON public.student_grades;
CREATE TRIGGER trigger_update_student_progress
  AFTER INSERT OR UPDATE ON public.student_grades
  FOR EACH ROW EXECUTE FUNCTION public.update_student_progress_from_grades();