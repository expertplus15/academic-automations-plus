-- STRUCTURE ACADÉMIQUE DUTGE COMPLÈTE

-- Créer le département Gestion et Commerce
INSERT INTO public.departments (name, code, created_at, updated_at) VALUES
('Département Gestion et Commerce', 'DEPT-GEST', now(), now())
ON CONFLICT (code) DO UPDATE SET 
  name = 'Département Gestion et Commerce',
  updated_at = now();

-- Créer le programme DUTGE
INSERT INTO public.programs (
  code, name, description, duration_years, 
  department_id, created_at, updated_at
) VALUES (
  'DUTGE', 
  'DUT Gestion des Entreprises',
  'Diplôme Universitaire de Technologie en Gestion des Entreprises - Formation en 2 ans, 4 semestres, 120 ECTS',
  2,
  (SELECT id FROM public.departments WHERE code = 'DEPT-GEST'),
  now(), now()
)
ON CONFLICT (code) DO UPDATE SET
  name = 'DUT Gestion des Entreprises',
  description = 'Diplôme Universitaire de Technologie en Gestion des Entreprises - Formation en 2 ans, 4 semestres, 120 ECTS',
  duration_years = 2,
  department_id = (SELECT id FROM public.departments WHERE code = 'DEPT-GEST'),
  updated_at = now();

-- Créer les spécialisations
INSERT INTO public.specializations (name, code, program_id, description, created_at, updated_at) VALUES
('Gestion Commerciale', 'GC', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion commerciale et marketing', now(), now()),
('Gestion Administrative', 'GA', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion administrative et ressources humaines', now(), now()),
('Gestion Financière', 'GF', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion financière et comptabilité', now(), now())
ON CONFLICT (code, program_id) DO NOTHING;

-- Créer les niveaux académiques spécifiques avec order_index uniques
INSERT INTO public.academic_levels (name, code, education_cycle, order_index, duration_years, semesters, ects_credits, created_at, updated_at) VALUES
('DUT1-GE', 'DUT1GE', 'short', 11, 1, 2, 60, now(), now()),
('DUT2-GE', 'DUT2GE', 'short', 12, 1, 2, 60, now(), now())
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  education_cycle = 'short',
  order_index = EXCLUDED.order_index,
  duration_years = EXCLUDED.duration_years,
  semesters = EXCLUDED.semesters,
  ects_credits = EXCLUDED.ects_credits,
  updated_at = now();

-- Créer l'année académique 2023/2024
INSERT INTO public.academic_years (name, start_date, end_date, is_current, status, created_at, updated_at)
VALUES ('2023/2024', '2023-09-01', '2024-06-30', true, 'active', now(), now())
ON CONFLICT (name) DO UPDATE SET
  start_date = '2023-09-01',
  end_date = '2024-06-30',
  is_current = true,
  status = 'active',
  updated_at = now();

-- Créer la classe principale et les groupes
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
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  max_students = EXCLUDED.max_students,
  current_students = EXCLUDED.current_students,
  program_id = EXCLUDED.program_id,
  academic_year_id = EXCLUDED.academic_year_id,
  metadata = EXCLUDED.metadata,
  updated_at = now();

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
 jsonb_build_object('salle', 'Labo Info 1'), now(), now())
ON CONFLICT (code) DO NOTHING;

-- Créer toutes les matières (18 au total)
INSERT INTO public.subjects (name, code, credits_ects, level_id, program_id, created_at, updated_at) VALUES
-- SEMESTRE 3 (9 matières)
('Droit des Affaires', 'DROIT401', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Problèmes économiques internationaux', 'ECO402', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Mix marketing et planification', 'MARK403', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Calcul et analyse des coûts', 'COMPTA404', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Techniques Quantitatives', 'MATH405', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Environnement informatique 2', 'INFO406', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Communication professionnelle', 'COMM407', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Anglais', 'LANG408', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Projet personnel et professionnel 3', 'PPP409', 2, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
-- SEMESTRE 4 (9 matières)
('Finance d''entreprise', 'FIN501', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Gestion de production', 'PROD502', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Stratégie et création d''entreprise', 'STRAT503', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Négociation commerciale et achat', 'NEGO504', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Techniques du commerce international', 'COM505', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Anglais', 'LANG506', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Projet personnel et professionnel 4', 'PPP507', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Projet Tutoré 2', 'PROJ508', 3, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now()),
('Stage', 'STAGE509', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now())
ON CONFLICT (code) DO NOTHING;

-- Configuration système de notation
UPDATE public.system_settings 
SET 
  institution_name = 'Université - DUT Gestion des Entreprises',
  grade_scale_max = 20.00,
  passing_grade_min = 10.00,
  updated_at = now()
WHERE EXISTS (SELECT 1 FROM public.system_settings);

INSERT INTO public.system_settings (
  institution_name, grade_scale_max, passing_grade_min, 
  default_language, default_currency, created_at, updated_at
) 
SELECT 
  'Université - DUT Gestion des Entreprises', 20.00, 10.00, 
  'fr', 'EUR', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings);

-- RAPPORT FINAL DE VALIDATION
SELECT 
  '✅ STRUCTURE ACADÉMIQUE DUTGE CRÉÉE AVEC SUCCÈS!' as statut,
  'Étape 1 de la feuille de route terminée' as phase,
  (SELECT name FROM public.departments WHERE code = 'DEPT-GEST') as departement,
  (SELECT name FROM public.programs WHERE code = 'DUTGE') as programme,
  (SELECT COUNT(*) FROM public.specializations WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as specialisations,
  (SELECT COUNT(*) FROM public.academic_levels WHERE code LIKE 'DUT%GE') as niveaux,
  (SELECT COUNT(*) FROM public.class_groups WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as classes_groupes,
  (SELECT COUNT(*) FROM public.subjects WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as matieres_total,
  (SELECT COUNT(*) FROM public.subjects WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE') AND code LIKE '%40%') as matieres_s3,
  (SELECT COUNT(*) FROM public.subjects WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE') AND code LIKE '%50%') as matieres_s4;