-- Ajouter des colonnes pour la gestion des années académiques
ALTER TABLE public.academic_years 
ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS validation_status VARCHAR(20) DEFAULT 'draft' CHECK (validation_status IN ('draft', 'validated', 'archived'));

-- Ajouter une colonne pour distinguer l'année d'inscription de l'année académique courante
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS enrollment_year_id UUID REFERENCES public.academic_years(id),
ADD COLUMN IF NOT EXISTS current_academic_year_id UUID REFERENCES public.academic_years(id);

-- Migrer les données existantes : l'academic_year_id actuel devient l'enrollment_year_id
UPDATE public.students 
SET enrollment_year_id = academic_year_id,
    current_academic_year_id = academic_year_id
WHERE academic_year_id IS NOT NULL;

-- Créer une fonction pour valider une année académique
CREATE OR REPLACE FUNCTION public.validate_academic_year(p_year_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verifier que l'utilisateur a les droits
  IF get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can validate academic years';
  END IF;
  
  -- Valider l'annee
  UPDATE public.academic_years
  SET validation_status = 'validated',
      validated_at = now(),
      validated_by = auth.uid()
  WHERE id = p_year_id AND validation_status = 'draft';
  
  -- Verifier qu'une ligne a ete mise a jour
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Academic year not found or already validated';
  END IF;
END;
$$;

-- Créer une fonction pour archiver une année académique validée
CREATE OR REPLACE FUNCTION public.archive_academic_year(p_year_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verifier que l'utilisateur a les droits
  IF get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can archive academic years';
  END IF;
  
  -- Archiver l'annee (elle doit etre validee)
  UPDATE public.academic_years
  SET validation_status = 'archived',
      is_archived = true,
      archived_at = now(),
      archived_by = auth.uid(),
      is_current = false
  WHERE id = p_year_id AND validation_status = 'validated';
  
  -- Verifier qu'une ligne a ete mise a jour
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Academic year not found or not validated';
  END IF;
END;
$$;

-- Créer une fonction pour désarchiver une année académique
CREATE OR REPLACE FUNCTION public.unarchive_academic_year(p_year_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verifier que l'utilisateur a les droits
  IF get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can unarchive academic years';
  END IF;
  
  -- Desarchiver l'annee
  UPDATE public.academic_years
  SET validation_status = 'validated',
      is_archived = false,
      archived_at = NULL,
      archived_by = NULL
  WHERE id = p_year_id AND validation_status = 'archived';
  
  -- Verifier qu'une ligne a ete mise a jour
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Academic year not found or not archived';
  END IF;
END;
$$;

-- Créer une fonction pour faire passer les étudiants à l'année suivante
CREATE OR REPLACE FUNCTION public.promote_students_to_next_year(p_from_year_id UUID, p_to_year_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  promoted_count INTEGER := 0;
BEGIN
  -- Verifier que l'utilisateur a les droits
  IF get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can promote students to next year';
  END IF;
  
  -- Verifier que l'annee source est validee
  IF NOT EXISTS (
    SELECT 1 FROM public.academic_years 
    WHERE id = p_from_year_id AND validation_status = 'validated'
  ) THEN
    RAISE EXCEPTION 'Source academic year must be validated';
  END IF;
  
  -- Faire passer les etudiants a l'annee suivante
  UPDATE public.students
  SET current_academic_year_id = p_to_year_id
  WHERE current_academic_year_id = p_from_year_id
    AND status = 'active';
  
  GET DIAGNOSTICS promoted_count = ROW_COUNT;
  
  RETURN promoted_count;
END;
$$;

-- Mettre à jour les années existantes avec le statut approprié
UPDATE public.academic_years 
SET validation_status = CASE 
  WHEN status = 'completed' THEN 'archived'
  WHEN status = 'active' THEN 'validated'
  ELSE 'draft'
END,
is_archived = CASE WHEN status = 'completed' THEN true ELSE false END;

-- Créer des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_students_enrollment_year ON public.students(enrollment_year_id);
CREATE INDEX IF NOT EXISTS idx_students_current_academic_year ON public.students(current_academic_year_id);
CREATE INDEX IF NOT EXISTS idx_academic_years_validation_status ON public.academic_years(validation_status);
CREATE INDEX IF NOT EXISTS idx_academic_years_archived ON public.academic_years(is_archived);