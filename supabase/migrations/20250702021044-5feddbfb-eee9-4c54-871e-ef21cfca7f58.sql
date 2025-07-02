-- Fonction pour créer des comptes de démonstration
CREATE OR REPLACE FUNCTION create_demo_accounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Note: Les comptes utilisateurs doivent être créés via l'interface Auth de Supabase
  -- Cette fonction crée les données de support nécessaires
  
  -- Créer un département de démonstration
  INSERT INTO public.departments (id, name, code) VALUES 
    ('00000000-0000-0000-0000-000000000010', 'Informatique', 'INFO')
  ON CONFLICT (id) DO NOTHING;

  -- Créer un niveau académique de démonstration
  INSERT INTO public.academic_levels (id, name, code, education_cycle, order_index) VALUES 
    ('00000000-0000-0000-0000-000000000020', 'Licence', 'L', 'undergraduate', 1)
  ON CONFLICT (id) DO NOTHING;

  -- Créer un programme de démonstration
  INSERT INTO public.programs (id, name, code, description, department_id, level_id, duration_years) VALUES 
    ('00000000-0000-0000-0000-000000000030', 'Licence Informatique', 'L-INFO', 'Programme de licence en informatique', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020', 3)
  ON CONFLICT (id) DO NOTHING;

  -- Créer une année académique courante
  INSERT INTO public.academic_years (id, name, start_date, end_date, is_current, status) VALUES 
    ('00000000-0000-0000-0000-000000000050', '2024-2025', '2024-09-01', '2025-06-30', true, 'active')
  ON CONFLICT (id) DO NOTHING;

  -- Créer quelques matières de démonstration
  INSERT INTO public.subjects (id, code, name, description, credits_ects, status) VALUES 
    ('00000000-0000-0000-0000-000000000060', 'MATH101', 'Mathématiques I', 'Cours de mathématiques fondamentales', 6, 'active'),
    ('00000000-0000-0000-0000-000000000061', 'INFO101', 'Programmation I', 'Introduction à la programmation', 6, 'active'),
    ('00000000-0000-0000-0000-000000000062', 'ALGO101', 'Algorithmique', 'Bases de l''algorithmique', 4, 'active')
  ON CONFLICT (id) DO NOTHING;

  -- Créer des groupes de classes
  INSERT INTO public.class_groups (id, name, code, group_type, max_students, program_id, academic_year_id) VALUES 
    ('00000000-0000-0000-0000-000000000070', 'L1 Info Groupe A', 'L1-INFO-A', 'class', 30, '00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000050'),
    ('00000000-0000-0000-0000-000000000071', 'L1 Info Groupe B', 'L1-INFO-B', 'class', 30, '00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000050')
  ON CONFLICT (id) DO NOTHING;

END;
$$;

-- Exécuter la fonction
SELECT create_demo_accounts();