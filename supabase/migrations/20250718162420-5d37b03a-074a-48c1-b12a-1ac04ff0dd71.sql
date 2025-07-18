
-- Ajouter la colonne group_id à la table students
ALTER TABLE public.students 
ADD COLUMN group_id uuid REFERENCES public.class_groups(id);

-- Ajouter un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_students_group_id ON public.students(group_id);

-- Ajouter un commentaire pour documenter
COMMENT ON COLUMN public.students.group_id IS 'Référence vers le groupe de classe (TD, TP, etc.) auquel appartient l''étudiant';
