-- Insert sample exams data (corrected with proper room types)

-- First ensure we have an academic year
INSERT INTO public.academic_years (id, name, start_date, end_date, is_current, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', '2024-2025', '2024-09-01', '2025-06-30', true, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert some rooms with correct room types
INSERT INTO public.rooms (id, code, name, capacity, room_type, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440030', 'AMP-A', 'Amphi A', 150, 'amphitheater', 'available'),
  ('550e8400-e29b-41d4-a716-446655440031', 'B102', 'Salle B102', 85, 'classroom', 'available'),
  ('550e8400-e29b-41d4-a716-446655440032', 'AMP-C', 'Amphi C', 200, 'amphitheater', 'available'),
  ('550e8400-e29b-41d4-a716-446655440033', 'INFO1', 'Salle Info1', 40, 'lab', 'available')
ON CONFLICT (id) DO NOTHING;

-- Insert some teacher profiles
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440040', 'marie.dubois@univ.fr', 'Dr. Marie Dubois', 'teacher'),
  ('550e8400-e29b-41d4-a716-446655440041', 'jean.martin@univ.fr', 'Prof. Jean Martin', 'teacher'),
  ('550e8400-e29b-41d4-a716-446655440042', 'sophie.laurent@univ.fr', 'Dr. Sophie Laurent', 'teacher')
ON CONFLICT (id) DO NOTHING;

-- Insert sample exams using existing subjects and programs
INSERT INTO public.exams (id, subject_id, academic_year_id, program_id, exam_type, title, description, duration_minutes, max_students, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440050', '88b78a5a-4812-4928-93cd-768411770982', '550e8400-e29b-41d4-a716-446655440001', 'd06ae1ad-7594-4136-bd81-33761ba7b198', 'written', 'Examen Final Cryptographie', 'Examen final du cours de cryptographie', 180, 120, 'draft'),
  ('550e8400-e29b-41d4-a716-446655440051', 'a4cd9cbc-5732-45c0-85b1-083902f57f41', '550e8400-e29b-41d4-a716-446655440001', 'd06ae1ad-7594-4136-bd81-33761ba7b198', 'written', 'Partiel GEII', 'Examen de mi-semestre GEII', 120, 85, 'draft'),
  ('550e8400-e29b-41d4-a716-446655440052', '2800d425-280f-42f6-af3c-bff625f4fa3e', '550e8400-e29b-41d4-a716-446655440001', '4cb91c8c-d170-4979-9d2c-935f83cf2915', 'written', 'QCM GEII Gestion', 'Questionnaire à choix multiples', 90, 150, 'scheduled'),
  ('550e8400-e29b-41d4-a716-446655440053', 'bd14aa1b-36c6-425f-93f9-a5c2d2233a56', '550e8400-e29b-41d4-a716-446655440001', NULL, 'practical', 'TP Pratique', 'Travaux pratiques', 240, 40, 'draft'),
  ('550e8400-e29b-41d4-a716-446655440054', '7dbcb4d6-3ecf-4cd6-89b0-b52fb9b242e2', '550e8400-e29b-41d4-a716-446655440001', NULL, 'written', 'Contrôle RT', 'Contrôle continu', 120, 85, 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- Insert exam sessions with future dates
INSERT INTO public.exam_sessions (id, exam_id, room_id, start_time, end_time, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440032', '2025-01-25 10:30:00+01', '2025-01-25 12:00:00+01', 'scheduled'),
  ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440031', '2025-01-22 14:00:00+01', '2025-01-22 16:00:00+01', 'scheduled'),
  ('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440030', '2025-01-20 09:00:00+01', '2025-01-20 12:00:00+01', 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- Insert exam supervisors
INSERT INTO public.exam_supervisors (id, session_id, teacher_id, supervisor_role, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440042', 'primary', 'assigned'),
  ('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440041', 'primary', 'confirmed'),
  ('550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440040', 'primary', 'assigned')
ON CONFLICT (id) DO NOTHING;

-- Create deliberate conflicts for testing AI (same room, overlapping times)
INSERT INTO public.exam_sessions (id, exam_id, room_id, start_time, end_time, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440030', '2025-01-20 09:30:00+01', '2025-01-20 11:30:00+01', 'scheduled')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exam_supervisors (id, session_id, teacher_id, supervisor_role, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440074', '550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440040', 'primary', 'assigned')
ON CONFLICT (id) DO NOTHING;