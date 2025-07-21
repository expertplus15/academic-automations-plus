
-- 1. Identifier et supprimer la première année "2024-2025" (celle sans étudiants)
DELETE FROM public.academic_years 
WHERE name = '2024-2025' 
AND id NOT IN (
  SELECT DISTINCT academic_year_id 
  FROM public.students 
  WHERE academic_year_id IS NOT NULL
);

-- 2. Normaliser le format "2023/2024" vers "2023-2024"
UPDATE public.academic_years 
SET name = '2023-2024' 
WHERE name = '2023/2024';

-- 3. Corriger les statuts des années académiques
-- Marquer toutes les années comme non-courantes d'abord
UPDATE public.academic_years SET is_current = false;

-- Marquer l'année 2024-2025 comme courante (nous sommes actuellement en 2025)
UPDATE public.academic_years 
SET is_current = true, status = 'current'
WHERE name = '2024-2025';

-- Marquer l'année 2023-2024 comme complétée
UPDATE public.academic_years 
SET status = 'completed'
WHERE name = '2023-2024';

-- 4. Créer l'année académique 2025-2026 pour la prochaine année
INSERT INTO public.academic_years (id, name, start_date, end_date, status, is_current)
VALUES (
  gen_random_uuid(),
  '2025-2026',
  '2025-09-01',
  '2026-06-30',
  'planning',
  false
)
ON CONFLICT (name) DO NOTHING;

-- 5. Redistribuer les étudiants selon leur année d'inscription
-- Les étudiants avec numéros "2324*" vont vers 2023-2024
UPDATE public.students 
SET academic_year_id = (
  SELECT id FROM public.academic_years WHERE name = '2023-2024' LIMIT 1
)
WHERE student_number LIKE '2324%';

-- Les étudiants avec numéros "2425*" restent en 2024-2025
UPDATE public.students 
SET academic_year_id = (
  SELECT id FROM public.academic_years WHERE name = '2024-2025' LIMIT 1
)
WHERE student_number LIKE '2425%';

-- 6. Vérifier et corriger les étudiants sans année académique
UPDATE public.students 
SET academic_year_id = (
  SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1
)
WHERE academic_year_id IS NULL;
