-- Add test data for student_grades table
-- Note: These are sample data for testing the matrix interface

-- First, let's check what students, subjects, and evaluation_types we have
-- and then add sample grades

-- Insert sample student grades for testing
-- Assuming we have student IDs and subject IDs from existing data
-- We'll create realistic test data

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
) 
SELECT 
  s.id as student_id,
  subj.id as subject_id,
  et.id as evaluation_type_id,
  CASE 
    WHEN random() < 0.7 THEN (random() * 5 + 10)::numeric(5,2) -- Most grades between 10-15
    WHEN random() < 0.9 THEN (random() * 3 + 15)::numeric(5,2) -- Some good grades 15-18
    ELSE (random() * 2 + 18)::numeric(5,2) -- Few excellent grades 18-20
  END as grade,
  20.00 as max_grade,
  CURRENT_DATE - (random() * 30)::int as evaluation_date,
  1 as semester,
  ay.id as academic_year_id,
  random() < 0.6 as is_published -- 60% published, 40% draft
FROM 
  public.students s
  CROSS JOIN public.subjects subj
  CROSS JOIN public.evaluation_types et
  CROSS JOIN (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1) ay
WHERE 
  s.status = 'active'
  AND et.is_active = true
  -- Add some randomness to avoid creating grades for every combination
  AND random() < 0.4 -- Only create grades for ~40% of possible combinations
ON CONFLICT DO NOTHING;