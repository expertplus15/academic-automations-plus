-- Créer des données de test pour démontrer les conflits d'examens

-- Nettoyer les anciennes données de test si elles existent
DELETE FROM public.exam_sessions WHERE exam_id IN (
  SELECT id FROM public.exams WHERE title LIKE 'Test Exam%'
);
DELETE FROM public.exams WHERE title LIKE 'Test Exam%';

-- Créer des examens de test avec des IDs spécifiques
INSERT INTO public.exams (id, title, exam_type, duration_minutes, status, academic_year_id)
VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Test Exam Math', 'written', 120, 'scheduled', 
   (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1)),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Test Exam Info', 'written', 90, 'scheduled',
   (SELECT id FROM public.academic_years WHERE is_current = true LIMIT 1))
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status;

-- Créer des sessions d'examens avec CONFLIT INTENTIONNEL dans la même salle
-- Ceci créera un conflit détectable par la fonction detect_exam_conflicts
INSERT INTO public.exam_sessions (id, exam_id, room_id, start_time, end_time, status, actual_students_count)
VALUES 
  -- Session 1: Math de 9h à 11h dans la première salle disponible
  ('11111111-1111-1111-1111-111111111111'::uuid, 
   '11111111-1111-1111-1111-111111111111'::uuid,
   (SELECT id FROM public.rooms LIMIT 1),
   '2024-01-20 09:00:00+00', '2024-01-20 11:00:00+00', 'scheduled', 100),
  -- Session 2: Info de 9h30 à 11h dans la MÊME SALLE (CONFLIT INTENTIONNEL!)
  ('22222222-2222-2222-2222-222222222222'::uuid, 
   '22222222-2222-2222-2222-222222222222'::uuid,
   (SELECT id FROM public.rooms LIMIT 1),  -- MÊME SALLE = CONFLIT!
   '2024-01-20 09:30:00+00', '2024-01-20 11:00:00+00', 'scheduled', 80)
ON CONFLICT (id) DO UPDATE SET
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  status = EXCLUDED.status;

-- Tester immédiatement la détection de conflits
SELECT 'Test de détection de conflits:' as message;
SELECT * FROM public.detect_exam_conflicts();