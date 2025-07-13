-- Correction simplifiée des données critiques du module académique

-- 1. Corriger la table specializations (filières)
-- Supprimer les enregistrements orphelins
DELETE FROM public.specializations WHERE program_id NOT IN (SELECT id FROM public.programs);

-- Créer 5 spécialisations réalistes liées aux programmes existants
INSERT INTO public.specializations (id, name, code, description, program_id, credits_required, is_mandatory, max_students, created_at) 
SELECT 
  gen_random_uuid(),
  'Spécialisation ' || ROW_NUMBER() OVER(),
  'SPEC-' || LPAD(ROW_NUMBER() OVER()::text, 2, '0'),
  'Spécialisation dans le domaine de ' || p.name,
  p.id as program_id,
  30 as credits_required,
  false as is_mandatory,
  25 as max_students,
  now()
FROM public.programs p
LIMIT 5;

-- 2. Créer quelques salles de base si nécessaire
INSERT INTO public.rooms (id, name, code, capacity, room_type, created_at)
SELECT 
  gen_random_uuid(),
  'Salle ' || series,
  'S' || LPAD(series::text, 2, '0'),
  30,
  'classroom',
  now()
FROM generate_series(1, 5) as series
WHERE NOT EXISTS (SELECT 1 FROM public.rooms LIMIT 1);

-- 3. Générer 20 créneaux d'emploi du temps réalistes
INSERT INTO public.timetables (
  id, subject_id, program_id, academic_year_id, room_id,
  day_of_week, start_time, end_time, status, slot_type, created_at
)
SELECT 
  gen_random_uuid(),
  s.id as subject_id,
  p.id as program_id,
  ay.id as academic_year_id,
  r.id as room_id,
  (((ROW_NUMBER() OVER()) - 1) % 5) + 1 as day_of_week, -- 1 à 5 (Lundi à Vendredi)
  CASE ((ROW_NUMBER() OVER()) % 4)
    WHEN 0 THEN '08:00'::time
    WHEN 1 THEN '10:30'::time  
    WHEN 2 THEN '14:00'::time
    ELSE '16:30'::time
  END as start_time,
  CASE ((ROW_NUMBER() OVER()) % 4)
    WHEN 0 THEN '10:00'::time
    WHEN 1 THEN '12:30'::time
    WHEN 2 THEN '16:00'::time 
    ELSE '18:30'::time
  END as end_time,
  'scheduled',
  'course',
  now()
FROM (SELECT id FROM public.subjects LIMIT 4) s
CROSS JOIN (SELECT id FROM public.programs LIMIT 2) p
CROSS JOIN (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1) ay
CROSS JOIN (SELECT id FROM public.rooms LIMIT 3) r
WHERE NOT EXISTS (SELECT 1 FROM public.timetables LIMIT 1)
LIMIT 20;

-- 4. Fonction utilitaire pour les statistiques académiques
CREATE OR REPLACE FUNCTION public.get_academic_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'programs', COALESCE((SELECT COUNT(*) FROM public.programs), 0),
    'specializations', COALESCE((SELECT COUNT(*) FROM public.specializations), 0),
    'levels', COALESCE((SELECT COUNT(*) FROM public.academic_levels), 0),
    'classes', COALESCE((SELECT COUNT(*) FROM public.class_groups), 0),
    'subjects', COALESCE((SELECT COUNT(*) FROM public.subjects), 0),
    'departments', COALESCE((SELECT COUNT(*) FROM public.departments), 0),
    'timetable_slots', COALESCE((SELECT COUNT(*) FROM public.timetables), 0),
    'active_students', COALESCE((SELECT COUNT(*) FROM public.students WHERE status = 'active'), 0)
  ) INTO result;
  
  RETURN result;
END;
$$;