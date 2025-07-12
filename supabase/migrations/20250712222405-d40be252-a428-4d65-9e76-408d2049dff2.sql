-- Correction ciblée des données critiques du module académique

-- 1. Corriger la table specializations (filières) uniquement
-- Supprimer les enregistrements orphelins
DELETE FROM public.specializations WHERE program_id NOT IN (SELECT id FROM public.programs);

-- Créer des spécialisations réalistes liées aux programmes existants
INSERT INTO public.specializations (id, name, code, description, program_id, credits_required, is_mandatory, max_students, created_at) 
SELECT 
  gen_random_uuid(),
  CASE 
    WHEN p.name ILIKE '%informatique%' THEN 'Développement Web'
    WHEN p.name ILIKE '%business%' OR p.name ILIKE '%gestion%' THEN 'Marketing Digital'
    WHEN p.name ILIKE '%science%' THEN 'Intelligence Artificielle'
    WHEN p.name ILIKE '%art%' THEN 'Design Graphique'
    ELSE 'Spécialisation Générale'
  END as name,
  CASE 
    WHEN p.name ILIKE '%informatique%' THEN 'DEV-WEB'
    WHEN p.name ILIKE '%business%' OR p.name ILIKE '%gestion%' THEN 'MKT-DIG'
    WHEN p.name ILIKE '%science%' THEN 'IA'
    WHEN p.name ILIKE '%art%' THEN 'DESIGN'
    ELSE 'SPEC-GEN'
  END as code,
  CASE 
    WHEN p.name ILIKE '%informatique%' THEN 'Spécialisation en développement d''applications web modernes'
    WHEN p.name ILIKE '%business%' OR p.name ILIKE '%gestion%' THEN 'Spécialisation en stratégies marketing digitales'
    WHEN p.name ILIKE '%science%' THEN 'Spécialisation en algorithmes d''intelligence artificielle'
    WHEN p.name ILIKE '%art%' THEN 'Spécialisation en création graphique et design'
    ELSE 'Spécialisation dans le domaine du programme'
  END as description,
  p.id as program_id,
  30 as credits_required,
  false as is_mandatory,
  25 as max_students,
  now()
FROM public.programs p
LIMIT 5;

-- 2. Créer quelques salles de base si nécessaire
INSERT INTO public.rooms (id, name, code, capacity, room_type, building, floor, created_at)
SELECT 
  gen_random_uuid(),
  'Salle ' || series,
  'S' || LPAD(series::text, 2, '0'),
  30 + (series * 5),
  'classroom',
  'Bâtiment Principal',
  1,
  now()
FROM generate_series(1, 5) as series
WHERE NOT EXISTS (SELECT 1 FROM public.rooms LIMIT 1);

-- 3. Générer des créneaux d'emploi du temps réalistes
WITH time_slots AS (
  SELECT 
    day_of_week,
    start_time,
    end_time
  FROM (
    VALUES 
      (1, '08:00'::time, '10:00'::time),
      (1, '10:30'::time, '12:30'::time),
      (2, '08:00'::time, '10:00'::time),
      (2, '10:30'::time, '12:30'::time),
      (3, '08:00'::time, '10:00'::time),
      (3, '10:30'::time, '12:30'::time),
      (4, '08:00'::time, '10:00'::time),
      (4, '10:30'::time, '12:30'::time),
      (5, '08:00'::time, '10:00'::time),
      (5, '10:30'::time, '12:30'::time)
  ) AS slots(day_of_week, start_time, end_time)
)
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
  ts.day_of_week,
  ts.start_time,
  ts.end_time,
  'scheduled',
  'course',
  now()
FROM (SELECT id FROM public.subjects LIMIT 3) s
CROSS JOIN (SELECT id FROM public.programs LIMIT 2) p
CROSS JOIN (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1) ay
CROSS JOIN (SELECT id FROM public.rooms LIMIT 2) r
CROSS JOIN time_slots ts
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