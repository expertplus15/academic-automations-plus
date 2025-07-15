-- Correction urgente: Assurer qu'une seule année académique est marquée comme courante
-- Étape 1: Démarquer toutes les années comme non-courantes
UPDATE public.academic_years SET is_current = false;

-- Étape 2: Marquer uniquement l'année la plus récente comme courante
UPDATE public.academic_years 
SET is_current = true 
WHERE id = (
  SELECT id 
  FROM public.academic_years 
  ORDER BY start_date DESC 
  LIMIT 1
);

-- Étape 3: Créer une contrainte pour éviter le problème à l'avenir
CREATE UNIQUE INDEX CONCURRENTLY idx_academic_years_single_current 
ON public.academic_years (is_current) 
WHERE is_current = true;

-- Étape 4: Créer un trigger pour maintenir l'unicité
CREATE OR REPLACE FUNCTION ensure_single_current_academic_year()
RETURNS TRIGGER AS $$
BEGIN
  -- Si on marque une année comme courante, démarquer toutes les autres
  IF NEW.is_current = true AND OLD.is_current = false THEN
    UPDATE public.academic_years 
    SET is_current = false 
    WHERE id != NEW.id AND is_current = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_current_academic_year
  BEFORE UPDATE ON public.academic_years
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_current_academic_year();