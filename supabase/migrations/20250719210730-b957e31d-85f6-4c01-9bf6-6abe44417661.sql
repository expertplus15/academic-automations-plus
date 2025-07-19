-- 1. Ajouter academic_year_id à la table students
ALTER TABLE public.students 
ADD COLUMN academic_year_id UUID REFERENCES public.academic_years(id);

-- 2. Ajouter first_name et last_name à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- 3. Créer l'année académique 2024-2025 si elle n'existe pas
INSERT INTO public.academic_years (id, name, start_date, end_date, status, is_current)
VALUES (
  gen_random_uuid(),
  '2024-2025',
  '2024-09-01',
  '2025-06-30',
  'current',
  true
)
ON CONFLICT DO NOTHING;

-- 4. Lier tous les étudiants existants à l'année académique 2024-2025
UPDATE public.students 
SET academic_year_id = (
  SELECT id FROM public.academic_years 
  WHERE name = '2024-2025' 
  LIMIT 1
)
WHERE academic_year_id IS NULL;

-- 5. Migrer les données full_name vers first_name et last_name
-- En supposant que full_name est au format "NOM Prénom" ou "NOM Prénom1 Prénom2"
UPDATE public.profiles 
SET 
  last_name = SPLIT_PART(full_name, ' ', 1),
  first_name = TRIM(SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1))
WHERE full_name IS NOT NULL 
  AND first_name IS NULL 
  AND last_name IS NULL;