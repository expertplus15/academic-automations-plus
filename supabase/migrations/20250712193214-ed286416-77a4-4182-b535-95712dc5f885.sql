-- Correction des données critiques du module académique (version corrigée)

-- 1. Corriger la table specializations (filières)
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
WHERE p.is_active = true
LIMIT 8;

-- 2. Créer des données de test pour la table class_groups (classes) si elle existe
INSERT INTO public.class_groups (id, name, code, group_type, max_students, current_students, program_id, academic_year_id, created_at)
SELECT 
  gen_random_uuid(),
  p.code || '-' || al.code || '-' || (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.created_at)),
  p.code || al.code || LPAD((ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.created_at))::text, 2, '0'),
  'class',
  CASE 
    WHEN al.code ILIKE '%L1%' OR al.code ILIKE '%first%' THEN 35
    WHEN al.code ILIKE '%L2%' OR al.code ILIKE '%second%' THEN 30
    ELSE 25
  END,
  CASE 
    WHEN al.code ILIKE '%L1%' OR al.code ILIKE '%first%' THEN 32
    WHEN al.code ILIKE '%L2%' OR al.code ILIKE '%second%' THEN 28
    ELSE 22
  END,
  p.id,
  ay.id,
  now()
FROM public.programs p
CROSS JOIN public.academic_levels al
CROSS JOIN (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1) ay
WHERE al.education_cycle IN ('licence', 'bachelor', 'master')
  AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'class_groups' AND table_schema = 'public')
LIMIT 24;

-- 3. Créer quelques salles de base si la table rooms n'a pas de données
INSERT INTO public.rooms (id, name, code, capacity, room_type, building, floor, created_at)
SELECT 
  gen_random_uuid(),
  'Salle ' || series || 'A',
  'S' || LPAD(series::text, 2, '0') || 'A',
  CASE 
    WHEN series % 3 = 0 THEN 50
    WHEN series % 3 = 1 THEN 30
    ELSE 25
  END,
  CASE 
    WHEN series % 4 = 0 THEN 'amphitheater'
    WHEN series % 4 = 1 THEN 'laboratory'
    ELSE 'classroom'
  END,
  'Bâtiment ' || CASE WHEN series <= 5 THEN 'A' ELSE 'B' END,
  CASE WHEN series <= 5 THEN 1 ELSE 2 END,
  now()
FROM generate_series(1, 10) as series
WHERE NOT EXISTS (SELECT 1 FROM public.rooms LIMIT 1);

-- 4. Générer des créneaux d'emploi du temps réalistes
WITH time_slots AS (
  SELECT 
    day_of_week,
    start_time,
    end_time
  FROM (
    VALUES 
      (1, '08:00'::time, '10:00'::time),
      (1, '10:30'::time, '12:30'::time),
      (1, '14:00'::time, '16:00'::time),
      (1, '16:30'::time, '18:30'::time),
      (2, '08:00'::time, '10:00'::time),
      (2, '10:30'::time, '12:30'::time),
      (2, '14:00'::time, '16:00'::time),
      (3, '08:00'::time, '10:00'::time),
      (3, '10:30'::time, '12:30'::time),
      (3, '14:00'::time, '16:00'::time),
      (4, '08:00'::time, '10:00'::time),
      (4, '10:30'::time, '12:30'::time),
      (4, '14:00'::time, '16:00'::time),
      (5, '08:00'::time, '10:00'::time),
      (5, '10:30'::time, '12:30'::time)
  ) AS slots(day_of_week, start_time, end_time)
),
available_data AS (
  SELECT 
    s.id as subject_id,
    p.id as program_id,
    ay.id as academic_year_id,
    r.id as room_id,
    ts.day_of_week,
    ts.start_time,
    ts.end_time,
    ROW_NUMBER() OVER () as rn
  FROM public.subjects s
  CROSS JOIN public.programs p
  CROSS JOIN (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1) ay
  CROSS JOIN public.rooms r
  CROSS JOIN time_slots ts
  WHERE s.is_active = true
  LIMIT 60
)
INSERT INTO public.timetables (
  id, subject_id, program_id, academic_year_id, room_id,
  day_of_week, start_time, end_time, status, slot_type, created_at
)
SELECT 
  gen_random_uuid(),
  subject_id,
  program_id, 
  academic_year_id,
  room_id,
  day_of_week,
  start_time,
  end_time,
  'scheduled',
  'course',
  now()
FROM available_data
WHERE NOT EXISTS (SELECT 1 FROM public.timetables LIMIT 1);

-- 5. Fonction utilitaire pour les statistiques académiques
CREATE OR REPLACE FUNCTION public.get_academic_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'programs', COALESCE((SELECT COUNT(*) FROM public.programs WHERE is_active = true), 0),
    'specializations', COALESCE((SELECT COUNT(*) FROM public.specializations), 0),
    'levels', COALESCE((SELECT COUNT(*) FROM public.academic_levels), 0),
    'classes', COALESCE((SELECT COUNT(*) FROM public.class_groups), 0),
    'subjects', COALESCE((SELECT COUNT(*) FROM public.subjects WHERE is_active = true), 0),
    'departments', COALESCE((SELECT COUNT(*) FROM public.departments WHERE is_active = true), 0),
    'timetable_slots', COALESCE((SELECT COUNT(*) FROM public.timetables), 0),
    'active_students', COALESCE((SELECT COUNT(*) FROM public.students WHERE status = 'active'), 0)
  ) INTO result;
  
  RETURN result;
END;
$$;