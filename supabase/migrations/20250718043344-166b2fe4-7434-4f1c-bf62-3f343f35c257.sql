-- STRUCTURE ACADÉMIQUE DUTGE COMPLÈTE - VERSION SIMPLIFIÉE

-- 1. Créer le département Gestion et Commerce
INSERT INTO public.departments (name, code, created_at, updated_at) 
VALUES ('Département Gestion et Commerce', 'DEPT-GEST', now(), now());

-- 2. Créer le programme DUTGE
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
);

-- 3. Créer les 3 spécialisations
INSERT INTO public.specializations (name, code, program_id, description, created_at, updated_at) VALUES
('Gestion Commerciale', 'GC', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion commerciale et marketing', now(), now()),
('Gestion Administrative', 'GA', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion administrative et ressources humaines', now(), now()),
('Gestion Financière', 'GF', (SELECT id FROM public.programs WHERE code = 'DUTGE'), 'Spécialisation en gestion financière et comptabilité', now(), now());

-- 4. Créer les niveaux académiques DUT-GE avec order_index uniques
INSERT INTO public.academic_levels (name, code, education_cycle, order_index, duration_years, semesters, ects_credits, created_at, updated_at) VALUES
('DUT1-GE', 'DUT1GE', 'short', 11, 1, 2, 60, now(), now()),
('DUT2-GE', 'DUT2GE', 'short', 12, 1, 2, 60, now(), now());

-- 5. Vérifier/créer l'année académique 2023/2024 
INSERT INTO public.academic_years (name, start_date, end_date, is_current, status, created_at, updated_at)
SELECT '2023/2024', '2023-09-01', '2024-06-30', true, 'active', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.academic_years WHERE name = '2023/2024');

-- 6. Créer la classe principale DUT2-GE
INSERT INTO public.class_groups (
  name, code, group_type, max_students, current_students, 
  program_id, academic_year_id, metadata, created_at, updated_at
) VALUES (
  'DUT2-GE', 'DUT2GE-MAIN', 'main', 60, 17,
  (SELECT id FROM public.programs WHERE code = 'DUTGE'),
  (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
  jsonb_build_object(
    'responsable', 'Prof. Martin',
    'email', 'martin@univ.fr',
    'salle', 'Amphi GE'
  ),
  now(), now()
);

-- 7. Créer les 4 groupes TD et TP
INSERT INTO public.class_groups (
  name, code, group_type, max_students, current_students,
  program_id, academic_year_id, parent_group_id, metadata, created_at, updated_at
) VALUES 
('TD1-GE', 'TD1GE-SUB', 'td', 20, 6, 
 (SELECT id FROM public.programs WHERE code = 'DUTGE'),
 (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
 (SELECT id FROM public.class_groups WHERE code = 'DUT2GE-MAIN'),
 jsonb_build_object('salle', 'A204'), now(), now()),
('TD2-GE', 'TD2GE-SUB', 'td', 20, 6,
 (SELECT id FROM public.programs WHERE code = 'DUTGE'),
 (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
 (SELECT id FROM public.class_groups WHERE code = 'DUT2GE-MAIN'),
 jsonb_build_object('salle', 'A205'), now(), now()),
('TD3-GE', 'TD3GE-SUB', 'td', 20, 5,
 (SELECT id FROM public.programs WHERE code = 'DUTGE'),
 (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
 (SELECT id FROM public.class_groups WHERE code = 'DUT2GE-MAIN'),
 jsonb_build_object('salle', 'A206'), now(), now()),
('TP-INFO', 'TPINFO-SUB', 'tp', 30, 17,
 (SELECT id FROM public.programs WHERE code = 'DUTGE'),
 (SELECT id FROM public.academic_years WHERE name = '2023/2024'),
 (SELECT id FROM public.class_groups WHERE code = 'DUT2GE-MAIN'),
 jsonb_build_object('salle', 'Labo Info 1'), now(), now());

-- 8. Créer les 18 matières (9 pour S3 + 9 pour S4)
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
('Stage', 'STAGE509', 4, (SELECT id FROM public.academic_levels WHERE code = 'DUT2GE'), (SELECT id FROM public.programs WHERE code = 'DUTGE'), now(), now());

-- 9. Configuration système de notation (si pas déjà configuré)
INSERT INTO public.system_settings (
  institution_name, grade_scale_max, passing_grade_min, 
  default_language, default_currency, created_at, updated_at
) 
SELECT 'Université - DUT Gestion des Entreprises', 20.00, 10.00, 'fr', 'EUR', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings);

-- 10. RAPPORT FINAL DE VALIDATION
SELECT 
  '🎉 ÉTAPE 1 TERMINÉE - STRUCTURE DUTGE CRÉÉE!' as statut,
  'Toute la structure académique est en place' as resume,
  (SELECT name FROM public.departments WHERE code = 'DEPT-GEST') as departement_cree,
  (SELECT name FROM public.programs WHERE code = 'DUTGE') as programme_cree,
  (SELECT COUNT(*) FROM public.specializations WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as specialisations_creees,
  (SELECT COUNT(*) FROM public.academic_levels WHERE code LIKE 'DUT%GE') as niveaux_crees,
  (SELECT COUNT(*) FROM public.class_groups WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as classes_groupes_crees,
  (SELECT COUNT(*) FROM public.subjects WHERE program_id = (SELECT id FROM public.programs WHERE code = 'DUTGE')) as matieres_creees,
  'Prêt pour les 17 étudiants de 2023/2024' as etape_suivante;