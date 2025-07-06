-- Insert sample data for testing Exams IA module

-- First, let's ensure we have some academic years
INSERT INTO public.academic_years (id, name, start_date, end_date, is_current, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', '2024-2025', '2024-09-01', '2025-06-30', true, 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', '2023-2024', '2023-09-01', '2024-06-30', false, 'completed')
ON CONFLICT (id) DO NOTHING;

-- Insert some programs if they don't exist
INSERT INTO public.programs (id, name, code, description, duration_semesters) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'Informatique', 'INFO', 'Programme Informatique', 6),
  ('550e8400-e29b-41d4-a716-446655440011', 'Mathématiques', 'MATH', 'Programme Mathématiques', 6),
  ('550e8400-e29b-41d4-a716-446655440012', 'Économie', 'ECO', 'Programme Économie', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert some subjects
INSERT INTO public.subjects (id, name, code, credits_ects, department_id) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440020', 'Mathématiques Avancées', 'MATH301', 6, NULL),
  ('550e8400-e29b-41d4-a716-446655440021', 'Informatique Théorique', 'INFO201', 4, NULL),
  ('550e8400-e29b-41d4-a716-446655440022', 'Économie Générale', 'ECO101', 5, NULL),
  ('550e8400-e29b-41d4-a716-446655440023', 'Algèbre Linéaire', 'MATH201', 4, NULL),
  ('550e8400-e29b-41d4-a716-446655440024', 'Programmation Java', 'INFO301', 5, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert some rooms
INSERT INTO public.rooms (id, name, capacity, room_type, site_id, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440030', 'Amphi A', 150, 'amphitheater', NULL, 'available'),
  ('550e8400-e29b-41d4-a716-446655440031', 'Salle B102', 85, 'classroom', NULL, 'available'),
  ('550e8400-e29b-41d4-a716-446655440032', 'Amphi C', 200, 'amphitheater', NULL, 'available'),
  ('550e8400-e29b-41d4-a716-446655440033', 'Salle Info1', 40, 'computer_lab', NULL, 'available'),
  ('550e8400-e29b-41d4-a716-446655440034', 'Salle TP1', 30, 'lab', NULL, 'available')
ON CONFLICT (id) DO NOTHING;

-- Insert some profiles for teachers
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440040', 'marie.dubois@univ.fr', 'Dr. Marie Dubois', 'teacher'),
  ('550e8400-e29b-41d4-a716-446655440041', 'jean.martin@univ.fr', 'Prof. Jean Martin', 'teacher'),
  ('550e8400-e29b-41d4-a716-446655440042', 'sophie.laurent@univ.fr', 'Dr. Sophie Laurent', 'teacher'),
  ('550e8400-e29b-41d4-a716-446655440043', 'pierre.durand@univ.fr', 'Prof. Pierre Durand', 'teacher')
ON CONFLICT (id) DO NOTHING;

-- Insert sample exams
INSERT INTO public.exams (id, subject_id, academic_year_id, program_id, exam_type, title, description, duration_minutes, max_students, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'written', 'Examen Final Mathématiques Avancées', 'Examen final du cours', 180, 120, 'draft'),
  ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'written', 'Partiel Informatique Théorique', 'Examen de mi-semestre', 120, 85, 'draft'),
  ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', 'written', 'QCM Économie Générale', 'Questionnaire à choix multiples', 90, 150, 'scheduled'),
  ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'practical', 'TP Java Final', 'Travaux pratiques sur machine', 240, 40, 'draft'),
  ('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'written', 'Contrôle Algèbre Linéaire', 'Contrôle continu', 120, 85, 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- Insert some exam sessions
INSERT INTO public.exam_sessions (id, exam_id, room_id, start_time, end_time, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440032', '2024-01-25 10:30:00+01', '2024-01-25 12:00:00+01', 'scheduled'),
  ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440031', '2024-01-22 14:00:00+01', '2024-01-22 16:00:00+01', 'scheduled'),
  ('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440030', '2024-01-20 09:00:00+01', '2024-01-20 12:00:00+01', 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- Insert some exam supervisors
INSERT INTO public.exam_supervisors (id, session_id, teacher_id, supervisor_role, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440042', 'primary', 'assigned'),
  ('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440041', 'primary', 'confirmed'),
  ('550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440040', 'primary', 'assigned'),
  ('550e8400-e29b-41d4-a716-446655440073', '550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440043', 'secondary', 'assigned')
ON CONFLICT (id) DO NOTHING;

-- Create a deliberate conflict for testing
INSERT INTO public.exam_sessions (id, exam_id, room_id, start_time, end_time, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440030', '2024-01-20 09:30:00+01', '2024-01-20 11:30:00+01', 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- Add supervisor to create supervisor overlap conflict
INSERT INTO public.exam_supervisors (id, session_id, teacher_id, supervisor_role, status) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440074', '550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440040', 'primary', 'assigned')
ON CONFLICT (id) DO NOTHING;

-- Insert schedule generation records for analytics
INSERT INTO public.schedule_generations (id, academic_year_id, program_id, generated_by, status, generation_type, progress_percentage, success_rate, conflicts_count) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440001', NULL, '550e8400-e29b-41d4-a716-446655440040', 'completed', 'exam_schedule', 100, 94.5, 2),
  ('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440040', 'completed', 'exam_schedule', 100, 87.2, 1),
  ('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440001', NULL, '550e8400-e29b-41d4-a716-446655440040', 'in_progress', 'exam_schedule', 65, NULL, NULL)
ON CONFLICT (id) DO NOTHING;