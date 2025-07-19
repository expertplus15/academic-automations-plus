-- 1. Ajouter academic_year_id à la table students
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS academic_year_id UUID REFERENCES public.academic_years(id);

-- 2. Ajouter first_name et last_name à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- 3. Lier tous les étudiants existants à l'année académique courante
UPDATE public.students 
SET academic_year_id = (
  SELECT id FROM public.academic_years 
  WHERE is_current = true 
  LIMIT 1
)
WHERE academic_year_id IS NULL;

-- 4. Migrer les données full_name vers first_name et last_name
UPDATE public.profiles 
SET 
  last_name = SPLIT_PART(full_name, ' ', 1),
  first_name = TRIM(SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1))
WHERE full_name IS NOT NULL 
  AND first_name IS NULL 
  AND last_name IS NULL;