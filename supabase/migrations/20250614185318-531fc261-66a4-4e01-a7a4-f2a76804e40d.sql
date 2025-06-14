-- Add missing columns to subjects table to support full academic management
ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS program_id UUID,
ADD COLUMN IF NOT EXISTS level_id UUID,
ADD COLUMN IF NOT EXISTS class_group_id UUID;

-- Migrate data from courses to subjects if any exists
INSERT INTO public.subjects (
  name, code, description, credits_ects, program_id, created_at, updated_at
)
SELECT 
  name, 
  code, 
  description, 
  credits as credits_ects,
  program_id,
  created_at,
  updated_at
FROM public.courses
WHERE NOT EXISTS (
  SELECT 1 FROM public.subjects s WHERE s.code = courses.code
);

-- Drop the courses table as it's now redundant
DROP TABLE IF EXISTS public.courses;