-- Nettoyer les données de test existantes
DELETE FROM public.exam_sessions WHERE exam_id IN (
  SELECT id FROM public.exams WHERE title LIKE 'Examen %Test%'
);
DELETE FROM public.exams WHERE title LIKE 'Examen %Test%';

-- Créer une année académique de test
INSERT INTO public.academic_years (id, name, start_date, end_date, is_current, status)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '2023-2024 Test',
  '2023-09-01',
  '2024-06-30',
  true,
  'active'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  is_current = EXCLUDED.is_current;

-- Créer ou utiliser des salles existantes pour les tests
INSERT INTO public.rooms (id, code, name, building, capacity, room_type, equipment, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'TEST-AMPH-A', 'Amphi A Test', 'Test Building', 150, 'amphitheater', '[]', 'available'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'TEST-B102', 'Salle B102 Test', 'Test Building B', 80, 'classroom', '[]', 'available'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'TEST-AMPH-C', 'Amphi C Test', 'Test Building C', 200, 'amphitheater', '[]', 'available')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  capacity = EXCLUDED.capacity;

-- Utiliser un département existant ou créer un département de test
INSERT INTO public.departments (id, name, code)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'Test Department', 'TEST')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Créer des programmes de test avec la structure correcte
INSERT INTO public.programs (id, name, code, description, duration_years, department_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Test Licence Info', 'TEST-LIC-INFO', 'Programme test informatique', 3, '00000000-0000-0000-0000-000000000001'::uuid),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Test Licence Math', 'TEST-LIC-MATH', 'Programme test mathématiques', 3, '00000000-0000-0000-0000-000000000001'::uuid)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code;

-- Créer des matières de test
INSERT INTO public.subjects (id, name, code, credits_ects, subject_type)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Test Mathématiques Avancées', 'TEST-MATH301', 6, 'core'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Test Informatique Théorique', 'TEST-INFO301', 4, 'core'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Test Économie Générale', 'TEST-ECO101', 3, 'elective')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code;

-- Créer des examens de test avec conflits intentionnels
INSERT INTO public.exams (id, title, subject_id, academic_year_id, program_id, exam_type, duration_minutes, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Examen Test Mathématiques Avancées', 
   '00000000-0000-0000-0000-000000000001'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid,
   '00000000-0000-0000-0000-000000000002'::uuid,
   'written', 120, 'scheduled'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Examen Test Informatique Théorique', 
   '00000000-0000-0000-0000-000000000002'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid,
   '00000000-0000-0000-0000-000000000001'::uuid,
   'written', 90, 'scheduled'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Examen Test Économie Générale', 
   '00000000-0000-0000-0000-000000000003'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid,
   '00000000-0000-0000-0000-000000000001'::uuid,
   'written', 120, 'scheduled');

-- Créer des sessions d'examens avec CONFLITS INTENTIONNELS pour tester la détection
INSERT INTO public.exam_sessions (id, exam_id, room_id, start_time, end_time, status, max_students)
VALUES 
  -- Session 1: Math de 9h à 11h dans Amphi A
  ('00000000-0000-0000-0000-000000000001'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid,
   '00000000-0000-0000-0000-000000000001'::uuid,
   '2024-01-20 09:00:00+00', '2024-01-20 11:00:00+00', 'scheduled', 120),
  -- Session 2: Info de 9h30 à 11h dans la MÊME SALLE (CONFLIT!)
  ('00000000-0000-0000-0000-000000000002'::uuid, 
   '00000000-0000-0000-0000-000000000002'::uuid,
   '00000000-0000-0000-0000-000000000001'::uuid,  -- MÊME SALLE = CONFLIT!
   '2024-01-20 09:30:00+00', '2024-01-20 11:00:00+00', 'scheduled', 85),
  -- Session 3: Éco dans une autre salle (pas de conflit)
  ('00000000-0000-0000-0000-000000000003'::uuid, 
   '00000000-0000-0000-0000-000000000003'::uuid,
   '00000000-0000-0000-0000-000000000003'::uuid,
   '2024-01-25 10:30:00+00', '2024-01-25 12:30:00+00', 'scheduled', 150);