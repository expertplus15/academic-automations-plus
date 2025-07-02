-- Créer des comptes de démonstration
-- Insérer les profils de démonstration
INSERT INTO public.profiles (id, email, full_name, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@academic.com', 'Administrateur Démo', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'teacher@academic.com', 'Enseignant Démo', 'teacher'),
  ('00000000-0000-0000-0000-000000000003', 'student@academic.com', 'Étudiant Démo', 'student'),
  ('00000000-0000-0000-0000-000000000004', 'hr@academic.com', 'RH Démo', 'hr'),
  ('00000000-0000-0000-0000-000000000005', 'finance@academic.com', 'Finance Démo', 'finance')
ON CONFLICT (id) DO NOTHING;

-- Créer un département de démonstration
INSERT INTO public.departments (id, name, code, head_id) VALUES 
  ('00000000-0000-0000-0000-000000000010', 'Informatique', 'INFO', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Créer un niveau académique de démonstration
INSERT INTO public.academic_levels (id, name, code, education_cycle, order_index) VALUES 
  ('00000000-0000-0000-0000-000000000020', 'Licence', 'L', 'undergraduate', 1)
ON CONFLICT (id) DO NOTHING;

-- Créer un programme de démonstration
INSERT INTO public.programs (id, name, code, description, department_id, level_id, duration_years) VALUES 
  ('00000000-0000-0000-0000-000000000030', 'Licence Informatique', 'L-INFO', 'Programme de licence en informatique', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020', 3)
ON CONFLICT (id) DO NOTHING;

-- Créer un étudiant de démonstration
INSERT INTO public.students (id, profile_id, program_id, student_number, year_level, status) VALUES 
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000030', 'INFO2400001', 1, 'active')
ON CONFLICT (id) DO NOTHING;

-- Créer une année académique courante
INSERT INTO public.academic_years (id, name, start_date, end_date, is_current, status) VALUES 
  ('00000000-0000-0000-0000-000000000050', '2024-2025', '2024-09-01', '2025-06-30', true, 'active')
ON CONFLICT (id) DO NOTHING;