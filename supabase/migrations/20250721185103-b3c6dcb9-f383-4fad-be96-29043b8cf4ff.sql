-- Mettre à jour les classes DUTGE pour l'année académique actuelle 2024-2025
UPDATE class_groups 
SET academic_year_id = 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a'
WHERE program_id = 'ced83506-8666-487b-a310-f0b1a97b0c5c' 
  AND (academic_year_id IS NULL OR academic_year_id != 'f1ec50ec-0c44-4d39-bb8c-7196ed385a3a');

-- Vérifier aussi les matières pour ce programme
UPDATE subjects 
SET status = 'active'
WHERE program_id = 'ced83506-8666-487b-a310-f0b1a97b0c5c' 
  AND (status IS NULL OR status != 'active');