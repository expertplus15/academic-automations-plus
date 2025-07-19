-- Étape 1: Corriger les années académiques (marquer 2024-2025 comme courante)
UPDATE public.academic_years SET is_current = false;

UPDATE public.academic_years 
SET is_current = true 
WHERE name LIKE '%2024-2025%' OR name LIKE '%2024/2025%';

-- Créer la table de liaison student_academic_enrollments
CREATE TABLE IF NOT EXISTS public.student_academic_enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.programs(id),
    level_id UUID REFERENCES public.academic_levels(id),
    enrollment_status CHARACTER VARYING DEFAULT 'active',
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Contrainte d'unicité pour éviter les doublons
    UNIQUE(student_id, academic_year_id)
);

-- Activer RLS sur la nouvelle table
ALTER TABLE public.student_academic_enrollments ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour student_academic_enrollments
CREATE POLICY "Users can view student academic enrollments" 
ON public.student_academic_enrollments 
FOR SELECT 
USING (
    get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]) OR
    student_id IN (
        SELECT id FROM public.students WHERE profile_id = auth.uid()
    )
);

CREATE POLICY "Staff can manage student academic enrollments" 
ON public.student_academic_enrollments 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Peupler la table avec les données existantes (sans level_id s'il n'existe pas)
-- Les étudiants avec matricule 2324xxx sont inscrits pour les examens 2024-2025
INSERT INTO public.student_academic_enrollments (student_id, academic_year_id, program_id)
SELECT 
    s.id as student_id,
    ay.id as academic_year_id,
    s.program_id
FROM public.students s
CROSS JOIN public.academic_years ay
WHERE s.student_number LIKE '2324%'
  AND ay.is_current = true
ON CONFLICT (student_id, academic_year_id) DO NOTHING;

-- Trigger pour maintenir updated_at
CREATE TRIGGER update_student_academic_enrollments_updated_at
    BEFORE UPDATE ON public.student_academic_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();