-- Correction minimale des données critiques du module académique

-- 1. Nettoyer la table specializations des enregistrements orphelins
DELETE FROM public.specializations WHERE program_id NOT IN (SELECT id FROM public.programs);

-- 2. Ajouter 5 spécialisations valides liées aux programmes existants
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

-- 3. Créer quelques salles de base si nécessaire (structure minimale)
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

-- 4. Créer la fonction utilitaire pour les statistiques
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