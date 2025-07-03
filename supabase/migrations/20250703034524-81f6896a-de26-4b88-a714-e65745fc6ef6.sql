-- First let's disable the trigger temporarily to add test data
DROP TRIGGER IF EXISTS student_grades_progress_trigger ON public.student_grades;

-- Add a unique constraint to student_progress if it doesn't exist
ALTER TABLE public.student_progress 
ADD CONSTRAINT student_progress_unique_key 
UNIQUE (student_id, academic_year_id, semester);

-- Now add test data without triggering the function
INSERT INTO public.student_grades (
  student_id, 
  subject_id, 
  evaluation_type_id, 
  grade, 
  max_grade, 
  evaluation_date, 
  semester, 
  academic_year_id,
  is_published
) VALUES
-- Sample grades for existing students and subjects
(
  (SELECT id FROM public.students LIMIT 1),
  (SELECT id FROM public.subjects LIMIT 1),
  (SELECT id FROM public.evaluation_types LIMIT 1),
  15.50,
  20.00,
  CURRENT_DATE,
  1,
  (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1),
  true
),
(
  (SELECT id FROM public.students LIMIT 1),
  (SELECT id FROM public.subjects OFFSET 1 LIMIT 1),
  (SELECT id FROM public.evaluation_types OFFSET 1 LIMIT 1),
  12.75,
  20.00,
  CURRENT_DATE - 5,
  1,
  (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1),
  false
);

-- Re-create the trigger with the correct function
CREATE TRIGGER student_grades_progress_trigger
  AFTER INSERT OR UPDATE ON public.student_grades
  FOR EACH ROW EXECUTE FUNCTION public.update_student_progress_from_grades();