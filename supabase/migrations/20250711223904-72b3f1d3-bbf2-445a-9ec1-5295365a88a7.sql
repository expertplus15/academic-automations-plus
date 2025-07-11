-- Créer des données de test pour les examens avec conflits intentionnels
-- D'abord, créer une année académique courante si elle n'existe pas
INSERT INTO public.academic_years (id, name, start_date, end_date, is_current, status)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '2023-2024',
  '2023-09-01',
  '2024-06-30',
  true,
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Créer des salles de test
INSERT INTO public.rooms (id, name, capacity, room_type, building_name, floor, equipment, accessibility_features, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Amphi A', 150, 'amphitheater', 'Bâtiment Principal', 1, '["projecteur", "microphone", "tableau"]', '["rampe_acces", "places_pmr"]', 'available'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Salle B102', 80, 'classroom', 'Bâtiment B', 1, '["tableau", "ordinateurs"]', '[]', 'available'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Amphi C', 200, 'amphitheater', 'Bâtiment C', 0, '["projecteur", "son", "tableau"]', '["rampe_acces", "places_pmr"]', 'available')
ON CONFLICT (id) DO NOTHING;

-- Créer des programmes
INSERT INTO public.programs (id, name, code, level_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Licence Informatique', 'LIC-INFO', (SELECT id FROM public.academic_levels WHERE code = 'L' LIMIT 1)),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Licence Mathématiques', 'LIC-MATH', (SELECT id FROM public.academic_levels WHERE code = 'L' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Créer des matières
INSERT INTO public.subjects (id, name, code, credits_ects, subject_type)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Mathématiques Avancées', 'MATH301', 6, 'core'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Informatique Théorique', 'INFO301', 4, 'core'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Économie Générale', 'ECO101', 3, 'elective')
ON CONFLICT (id) DO NOTHING;

-- Créer des examens avec conflits intentionnels
INSERT INTO public.exams (id, title, subject_id, academic_year_id, program_id, exam_type, duration_minutes, status, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Examen Mathématiques Avancées', 
   '00000000-0000-0000-0000-000000000001'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid,
   '00000000-0000-0000-0000-000000000002'::uuid,
   'written', 120, 'scheduled', now()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Examen Informatique Théorique', 
   '00000000-0000-0000-0000-000000000002'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid,
   '00000000-0000-0000-0000-000000000001'::uuid,
   'written', 90, 'scheduled', now()),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Examen Économie Générale', 
   '00000000-0000-0000-0000-000000000003'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid,
   '00000000-0000-0000-0000-000000000001'::uuid,
   'written', 120, 'scheduled', now())
ON CONFLICT (id) DO NOTHING;

-- Créer des sessions d'examens avec CONFLITS INTENTIONNELS
-- Conflit 1: Même salle, horaires qui se chevauchent
INSERT INTO public.exam_sessions (id, exam_id, room_id, start_time, end_time, status, max_students)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 
   '00000000-0000-0000-0000-000000000001'::uuid,
   '00000000-0000-0000-0000-000000000001'::uuid,
   '2024-01-20 09:00:00+00', '2024-01-20 11:00:00+00', 'scheduled', 120),
  ('00000000-0000-0000-0000-000000000002'::uuid, 
   '00000000-0000-0000-0000-000000000002'::uuid,
   '00000000-0000-0000-0000-000000000001'::uuid,  -- MÊME SALLE !
   '2024-01-20 09:30:00+00', '2024-01-20 11:00:00+00', 'scheduled', 85), -- CHEVAUCHEMENT !
  ('00000000-0000-0000-0000-000000000003'::uuid, 
   '00000000-0000-0000-0000-000000000003'::uuid,
   '00000000-0000-0000-0000-000000000003'::uuid,
   '2024-01-25 10:30:00+00', '2024-01-25 12:30:00+00', 'scheduled', 150)
ON CONFLICT (id) DO NOTHING;