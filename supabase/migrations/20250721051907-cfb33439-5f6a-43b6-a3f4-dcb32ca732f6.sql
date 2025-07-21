-- Update promote_students_to_next_year function to allow archived academic years as source
CREATE OR REPLACE FUNCTION public.promote_students_to_next_year(p_from_year_id uuid, p_to_year_id uuid)
 RETURNS integer
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
  
  -- Verifier que l'annee source est validee ou archivee
  IF NOT EXISTS (
    SELECT 1 FROM public.academic_years 
    WHERE id = p_from_year_id AND validation_status IN ('validated', 'archived')
  ) THEN
    RAISE EXCEPTION 'Source academic year must be validated or archived';
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