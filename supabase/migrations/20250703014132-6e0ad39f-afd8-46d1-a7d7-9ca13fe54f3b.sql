-- 4. Function to auto-calculate and update student progress + trigger
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