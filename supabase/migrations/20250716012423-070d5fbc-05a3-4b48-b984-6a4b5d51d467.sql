-- Ajouter les contraintes uniques seulement si elles n'existent pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'document_variables_name_unique'
  ) THEN
    ALTER TABLE public.document_variables ADD CONSTRAINT document_variables_name_unique UNIQUE (name);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'document_templates_code_unique'
  ) THEN
    ALTER TABLE public.document_templates ADD CONSTRAINT document_templates_code_unique UNIQUE (code);
  END IF;
END $$;

-- Insérer des variables de base uniquement si elles n'existent pas
INSERT INTO public.document_variables (name, label, variable_type, category, description) VALUES
('student_name', 'Nom de l''étudiant', 'text', 'Étudiant', 'Nom complet de l''étudiant'),
('student_number', 'Numéro étudiant', 'text', 'Étudiant', 'Numéro d''identification de l''étudiant'),
('student_email', 'Email étudiant', 'email', 'Étudiant', 'Adresse email de l''étudiant'),
('student_program', 'Programme d''études', 'text', 'Étudiant', 'Programme dans lequel l''étudiant est inscrit'),
('student_level', 'Niveau d''études', 'text', 'Étudiant', 'Niveau actuel de l''étudiant'),
('enrollment_date', 'Date d''inscription', 'date', 'Étudiant', 'Date d''inscription de l''étudiant'),
('academic_year', 'Année académique', 'text', 'Académique', 'Année académique courante'),
('semester', 'Semestre', 'text', 'Académique', 'Semestre actuel'),
('institution_name', 'Nom de l''institution', 'text', 'Académique', 'Nom de l''établissement'),
('program_name', 'Nom du programme', 'text', 'Académique', 'Nom du programme d''études'),
('level_name', 'Nom du niveau', 'text', 'Académique', 'Nom du niveau d''études'),
('session_date', 'Date de session', 'date', 'Académique', 'Date de la session d''examen'),
('grades_table', 'Tableau des notes', 'table', 'Notes', 'Tableau détaillé des notes par matière'),
('overall_average', 'Moyenne générale', 'number', 'Notes', 'Moyenne générale de l''étudiant'),
('total_credits', 'Crédits totaux', 'number', 'Notes', 'Nombre total de crédits ECTS'),
('semester_average', 'Moyenne semestrielle', 'number', 'Notes', 'Moyenne du semestre'),
('attendance_rate', 'Taux de présence', 'number', 'Notes', 'Pourcentage de présence'),
('ranking', 'Classement', 'number', 'Notes', 'Classement dans la promotion')
ON CONFLICT (name) DO NOTHING;

-- Insérer des templates de base uniquement si ils n'existent pas
INSERT INTO public.document_templates (name, code, template_type, description, template_content) VALUES
('Relevé de Notes Standard', 'RELEVE_STANDARD', 'transcript', 'Relevé de notes officiel standard', 
'{"template": "ÉTABLISSEMENT: {{institution_name}}\n\nRELEVÉ DE NOTES\n\nÉtudiant: {{student_name}}\nNuméro: {{student_number}}\nProgramme: {{student_program}}\nNiveau: {{student_level}}\nAnnée académique: {{academic_year}}\n\n{{grades_table}}\n\nMoyenne générale: {{overall_average}}/20\nCrédits ECTS obtenus: {{total_credits}}\nTaux de présence: {{attendance_rate}}%\n\nÉtabli le {{session_date}}\n\nSignature et cachet de l''établissement"}'),

('Bulletin de Notes', 'BULLETIN_NOTES', 'report_card', 'Bulletin périodique de notes', 
'{"template": "{{institution_name}}\n\nBULLETIN DE NOTES\nSemestre {{semester}} - {{academic_year}}\n\nÉtudiant: {{student_name}} ({{student_number}})\nFormation: {{program_name}}\nNiveau: {{level_name}}\n\nRÉSULTATS:\n{{grades_table}}\n\nMoyenne semestrielle: {{semester_average}}/20\nMoyenne générale: {{overall_average}}/20\nClassement: {{ranking}}\nAssiduité: {{attendance_rate}}%\n\nObservations:\n[Espace pour commentaires]\n\nLe {{session_date}}"}'),

('Certificat de Scolarité', 'CERTIFICAT_SCOLARITE', 'enrollment_certificate', 'Certificat attestant de l''inscription', 
'{"template": "{{institution_name}}\n\nCERTIFICAT DE SCOLARITÉ\n\nJe soussigné(e), [Nom du responsable],\n[Titre/Fonction]\n\nCertifie que:\n\nM./Mme {{student_name}}\nNé(e) le [Date de naissance]\nNuméro étudiant: {{student_number}}\n\nEst régulièrement inscrit(e) pour l''année académique {{academic_year}} en:\n{{program_name}} - {{level_name}}\n\nDate d''inscription: {{enrollment_date}}\nAssiduité: {{attendance_rate}}%\n\nCertificat délivré pour faire valoir ce que de droit.\n\nFait à [Ville], le {{session_date}}\n\nSignature et cachet"}'),

('Attestation de Réussite', 'ATTESTATION_REUSSITE', 'success_certificate', 'Attestation de réussite d''examen', 
'{"template": "{{institution_name}}\n\nATTESTATION DE RÉUSSITE\n\nL''administration de {{institution_name}} atteste que:\n\n{{student_name}}\nNuméro étudiant: {{student_number}}\nFormation: {{program_name}}\n\nA obtenu les résultats suivants pour l''année {{academic_year}}:\n\n{{grades_table}}\n\nMoyenne générale: {{overall_average}}/20\nCrédits ECTS validés: {{total_credits}}\nMention: [À compléter selon la moyenne]\n\nEt a satisfait aux exigences pour la validation de son année d''études.\n\nÉtabli le {{session_date}}\n\nLe Directeur des Études"}')

ON CONFLICT (code) DO NOTHING;