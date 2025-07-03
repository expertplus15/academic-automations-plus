-- Phase 1A: Evaluation Module Foundation - Fixed Version
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