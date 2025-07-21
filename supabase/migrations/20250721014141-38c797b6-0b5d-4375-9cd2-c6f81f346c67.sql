-- 1. Handle ALL foreign key constraints by updating references to the duplicate academic year
-- Update exams
UPDATE public.exams 
SET academic_year_id = 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a'
WHERE academic_year_id = '550e8400-e29b-41d4-a716-446655440001';

-- Update ects_calculation_config
UPDATE public.ects_calculation_config 
SET academic_year_id = 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a'
WHERE academic_year_id = '550e8400-e29b-41d4-a716-446655440001';

-- Update any other tables that might reference this academic year
UPDATE public.timetables 
SET academic_year_id = 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a'
WHERE academic_year_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE public.student_grades 
SET academic_year_id = 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a'
WHERE academic_year_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE public.attendance_records 
SET academic_year_id = 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a'
WHERE academic_year_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE public.student_progress 
SET academic_year_id = 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a'
WHERE academic_year_id = '550e8400-e29b-41d4-a716-446655440001';

-- 2. Now safely delete the duplicate "2024-2025" year
DELETE FROM public.academic_years 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- 3. Normaliser le format "2023/2024" vers "2023-2024"
UPDATE public.academic_years 
SET name = '2023-2024' 
WHERE name = '2023/2024';

-- 4. Corriger les statuts des années académiques
-- Marquer toutes les années comme non-courantes d'abord
UPDATE public.academic_years SET is_current = false;

-- Marquer l'année 2024-2025 comme courante
UPDATE public.academic_years 
SET is_current = true, status = 'current'
WHERE name = '2024-2025';

-- Marquer l'année 2023-2024 comme complétée
UPDATE public.academic_years 
SET status = 'completed'
WHERE name = '2023-2024';

-- 5. Créer l'année académique 2025-2026 pour la prochaine année
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

-- 6. Redistribuer les étudiants selon leur année d'inscription
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

-- 7. Vérifier et corriger les étudiants sans année académique
UPDATE public.students 
SET academic_year_id = (
  SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1
)
WHERE academic_year_id IS NULL;