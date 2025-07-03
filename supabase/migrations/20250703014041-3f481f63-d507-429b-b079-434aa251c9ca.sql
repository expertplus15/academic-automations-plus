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
  v_grades_data JSONB := '{}';
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
    'generated_at', now()
  );
END;
$$;