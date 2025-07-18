-- PHASE 1: Mise à jour département et programme DUTGE
UPDATE public.departments 
SET 
  name = 'Département Gestion et Commerce',
  code = 'DEPT-GEST',
  head_name = 'Dr. Marie Lambert',
  email = 'marie.lambert@univ.fr',
  phone = '01 23 45 67 89',
  office = 'A301',
  updated_at = now()
WHERE name = 'Gestion des Entreprises';

UPDATE public.programs 
SET 
  code = 'DUTGE',
  name = 'DUT Gestion des Entreprises',
  description = 'Diplôme Universitaire de Technologie en Gestion des Entreprises - Formation en 2 ans, 4 semestres, 120 ECTS',
  duration_years = 2,
  department_id = (SELECT id FROM public.departments WHERE code = 'DEPT-GEST'),
  updated_at = now()
WHERE name = 'Gestion des Entreprises';

-- Créer les spécialisations
INSERT INTO public.specializations (name, code, program_id, description, created_at, updated_at) VALUES
('Gestion Commerciale', 'GC', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion commerciale et marketing', now(), now()),
('Gestion Administrative', 'GA', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion administrative et ressources humaines', now(), now()),
('Gestion Financière', 'GF', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion financière et comptabilité', now(), now());

-- PHASE 2: Créer les niveaux académiques spécifiques
INSERT INTO public.academic_levels (name, code, education_cycle, order_index, duration_years, semesters, ects_credits, created_at, updated_at) VALUES
('DUT1-GE', 'DUT1GE', 'undergraduate', 1, 1, 2, 60, now(), now()),
('DUT2-GE', 'DUT2GE', 'undergraduate', 2, 1, 2, 60, now(), now());

-- Créer l'année académique 2023/2024 si elle n'existe pas
INSERT INTO public.academic_years (name, start_date, end_date, is_current, status, created_at, updated_at)
VALUES ('2023/2024', '2023-09-01', '2024-06-30', true, 'active', now(), now())
ON CONFLICT DO NOTHING;

-- Créer la classe principale DUT2-GE
INSERT INTO public.class_groups (
  name, code, group_type, max_students, current_students, 
  program_id, academic_year_id, metadata, created_at, updated_at
) VALUES (
  'DUT2-GE', 'DUT2GE', 'main', 60, 17,
  (SELECT id FROM public.programs WHERE code = 'DUTGE'),
  (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
  jsonb_build_object(
    'responsable', 'Prof. Martin',
    'email', 'martin@univ.fr',
    'salle', 'Amphi GE'
  ),
  now(), now()
);

-- Créer les groupes TD et TP
INSERT INTO public.class_groups (
  name, code, group_type, max_students, current_students,
  program_id, academic_year_id, parent_group_id, metadata, created_at, updated_at
) VALUES 
('TD1-GE', 'TD1GE', 'td', 20, 6, 
 (SELECT id FROM public.programs WHERE code = 'DUTGE'),
 (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
 (SELECT id FROM public.class_groups WHERE code = 'DUT2GE'),
 jsonb_build_object('salle', 'A204'), now(), now()),
('TD2-GE', 'TD2GE', 'td', 20, 6,
 (SELECT id FROM public.programs WHERE code = 'DUTGE'),
 (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
 (SELECT id FROM public.class_groups WHERE code = 'DUT2GE'),
 jsonb_build_object('salle', 'A205'), now(), now()),
('TD3-GE', 'TD3GE', 'td', 20, 5,
 (SELECT id FROM public.programs WHERE code = 'DUTGE'),
 (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
 (SELECT id FROM public.class_groups WHERE code = 'DUT2GE'),
 jsonb_build_object('salle', 'A206'), now(), now()),
('TP-INFO', 'TPINFO', 'tp', 30, 17,
 (SELECT id FROM public.programs WHERE code = 'DUTGE'),
 (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
 (SELECT id FROM public.class_groups WHERE code = 'DUT2GE'),
 jsonb_build_object('salle', 'Labo Info 1'), now(), now());

-- PHASE 3: Créer toutes les matières SEMESTRE 3
INSERT INTO public.subjects (name, code, credits_ects, level_id, program_id, created_at, updated_at) VALUES
('Droit des Affaires', 'DROIT401', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Problèmes économiques internationaux', 'ECO402', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Mix marketing et planification', 'MARK403', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Calcul et analyse des coûts', 'COMPTA404', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Techniques Quantitatives', 'MATH405', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Environnement informatique 2', 'INFO406', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Communication professionnelle', 'COMM407', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Anglais', 'LANG408', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Projet personnel et professionnel 3', 'PPP409', 2, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now());

-- SEMESTRE 4
INSERT INTO public.subjects (name, code, credits_ects, level_id, program_id, created_at, updated_at) VALUES
('Finance d''entreprise', 'FIN501', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Gestion de production', 'PROD502', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Stratégie et création d''entreprise', 'STRAT503', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Négociation commerciale et achat', 'NEGO504', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Techniques du commerce international', 'COM505', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Anglais', 'LANG506', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Projet personnel et professionnel 4', 'PPP507', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Projet Tutoré 2', 'PROJ508', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Stage', 'STAGE509', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now());

-- PHASE 4: Configuration du système de notation
-- Créer ou mettre à jour les paramètres système
INSERT INTO public.system_settings (
  institution_name, grade_scale_max, passing_grade_min, 
  default_language, default_currency, created_at, updated_at
) VALUES (
  'Université - DUT Gestion des Entreprises', 20.00, 10.00, 
  'fr', 'EUR', now(), now()
)
ON CONFLICT (id) DO UPDATE SET
  grade_scale_max = 20.00,
  passing_grade_min = 10.00,
  updated_at = now();

-- Créer les types d'évaluation standard
INSERT INTO public.evaluation_types (name, code, weight_percentage, is_active, created_at, updated_at) VALUES
('Contrôle Continu 1', 'CC1', 25.0, true, now(), now()),
('Contrôle Continu 2', 'CC2', 25.0, true, now(), now()),
('Travaux Dirigés', 'TD', 20.0, true, now(), now()),
('Travaux Pratiques', 'TP', 20.0, true, now(), now()),
('Examen Final', 'EXAM', 50.0, true, now(), now())
ON CONFLICT (code) DO UPDATE SET
  weight_percentage = EXCLUDED.weight_percentage,
  updated_at = now();

-- Création du système de notation avec grading_systems si la table existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'grading_systems') THEN
    INSERT INTO public.grading_systems (
      name, scale_min, scale_max, passing_grade, 
      academic_year_id, is_default, created_at, updated_at
    ) VALUES (
      'Système DUTGE 2023/2024', 0.0, 20.0, 10.0,
      (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
      true, now(), now()
    )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- PHASE 5: Validation - Affichage des statistiques
SELECT 
  'Structure DUTGE créée avec succès!' as message,
  (SELECT COUNT(*) FROM public.departments WHERE code = 'DEPT-GEST') as departements,
  (SELECT COUNT(*) FROM public.programs WHERE code = 'DUTGE') as programmes,
  (SELECT COUNT(*) FROM public.specializations WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as specialisations,
  (SELECT COUNT(*) FROM public.academic_levels WHERE code LIKE 'DUT%GE') as niveaux,
  (SELECT COUNT(*) FROM public.class_groups WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as classes,
  (SELECT COUNT(*) FROM public.subjects WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as matieres;