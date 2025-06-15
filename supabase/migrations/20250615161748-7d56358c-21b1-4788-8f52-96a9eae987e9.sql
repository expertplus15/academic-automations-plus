-- Ajouter les nouvelles colonnes à la table academic_levels
ALTER TABLE public.academic_levels 
ADD COLUMN ects_credits INTEGER,
ADD COLUMN duration_years INTEGER DEFAULT 1,
ADD COLUMN semesters INTEGER DEFAULT 2;