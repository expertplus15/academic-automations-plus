-- Création des tables pour le module de promotion des étudiants

-- Table des campagnes de promotion
CREATE TABLE public.promotion_campaigns (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    source_academic_year_id UUID REFERENCES public.academic_years(id),
    target_academic_year_id UUID REFERENCES public.academic_years(id),
    campaign_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'cancelled')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Table des critères de promotion configurables
CREATE TABLE public.promotion_criteria (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    criteria_type VARCHAR NOT NULL CHECK (criteria_type IN ('minimum_average', 'attendance_rate', 'ects_credits', 'subject_validation', 'custom')),
    program_id UUID REFERENCES public.programs(id), -- NULL = critère global
    level_id UUID REFERENCES public.academic_levels(id), -- NULL = tous les niveaux
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    threshold_value DECIMAL(5,2), -- Valeur seuil (ex: 10.00 pour moyenne)
    weight DECIMAL(5,2) DEFAULT 1.00, -- Pondération du critère
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des évaluations individuelles de promotion
CREATE TABLE public.student_promotion_evaluations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.promotion_campaigns(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    calculated_average DECIMAL(5,2),
    attendance_rate DECIMAL(5,2),
    ects_earned DECIMAL(5,2),
    ects_required DECIMAL(5,2),
    criteria_met JSONB DEFAULT '{}', -- Détail des critères validés
    promotion_decision VARCHAR NOT NULL DEFAULT 'pending' CHECK (promotion_decision IN ('pending', 'promoted', 'repeat', 'conditional', 'excluded')),
    decision_reason TEXT,
    manual_override BOOLEAN DEFAULT false,
    override_reason TEXT,
    validated_by UUID REFERENCES auth.users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(campaign_id, student_id)
);

-- Table des rapports de promotion
CREATE TABLE public.promotion_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.promotion_campaigns(id) ON DELETE CASCADE,
    report_type VARCHAR NOT NULL CHECK (report_type IN ('summary', 'detailed', 'exceptions', 'statistics')),
    title VARCHAR NOT NULL,
    content JSONB NOT NULL,
    file_url TEXT,
    generated_by UUID REFERENCES auth.users(id),
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activation RLS
ALTER TABLE public.promotion_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_promotion_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_reports ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour promotion_campaigns
CREATE POLICY "Admins and teachers can manage promotion campaigns"
ON public.promotion_campaigns
FOR ALL
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Politiques RLS pour promotion_criteria
CREATE POLICY "Admins and teachers can manage promotion criteria"
ON public.promotion_criteria
FOR ALL
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Politiques RLS pour student_promotion_evaluations
CREATE POLICY "Admins and teachers can manage promotion evaluations"
ON public.student_promotion_evaluations
FOR ALL
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Students can view their own promotion evaluations"
ON public.student_promotion_evaluations
FOR SELECT
USING (student_id IN (
    SELECT id FROM public.students WHERE profile_id = auth.uid()
));

-- Politiques RLS pour promotion_reports
CREATE POLICY "Admins and teachers can manage promotion reports"
ON public.promotion_reports
FOR ALL
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Fonction pour calculer l'éligibilité d'un étudiant
CREATE OR REPLACE FUNCTION public.calculate_student_promotion_eligibility(
    p_student_id UUID,
    p_academic_year_id UUID,
    p_criteria_ids UUID[] DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB := '{}';
    v_student_data JSONB;
    v_criteria RECORD;
    v_overall_eligible BOOLEAN := true;
    v_criteria_results JSONB := '{}';
BEGIN
    -- Calculer les moyennes et statistiques de l'étudiant
    SELECT public.calculate_student_averages(p_student_id, p_academic_year_id, NULL) INTO v_student_data;
    
    -- Évaluer chaque critère
    FOR v_criteria IN 
        SELECT pc.* FROM public.promotion_criteria pc
        WHERE pc.is_active = true
        AND (p_criteria_ids IS NULL OR pc.id = ANY(p_criteria_ids))
        AND (pc.program_id IS NULL OR pc.program_id IN (
            SELECT program_id FROM public.students WHERE id = p_student_id
        ))
    LOOP
        CASE v_criteria.criteria_type
            WHEN 'minimum_average' THEN
                IF (v_student_data->>'overall_average')::DECIMAL >= v_criteria.threshold_value THEN
                    v_criteria_results := jsonb_set(v_criteria_results, 
                        ARRAY[v_criteria.id::text], 
                        jsonb_build_object('met', true, 'value', v_student_data->>'overall_average')
                    );
                ELSE
                    v_criteria_results := jsonb_set(v_criteria_results, 
                        ARRAY[v_criteria.id::text], 
                        jsonb_build_object('met', false, 'value', v_student_data->>'overall_average')
                    );
                    IF v_criteria.is_mandatory THEN
                        v_overall_eligible := false;
                    END IF;
                END IF;
            -- Ajouter d'autres types de critères selon les besoins
        END CASE;
    END LOOP;
    
    v_result := jsonb_build_object(
        'student_id', p_student_id,
        'academic_year_id', p_academic_year_id,
        'overall_eligible', v_overall_eligible,
        'criteria_results', v_criteria_results,
        'student_data', v_student_data,
        'calculated_at', now()
    );
    
    RETURN v_result;
END;
$$;

-- Fonction pour traiter une campagne de promotion
CREATE OR REPLACE FUNCTION public.process_promotion_campaign(
    p_campaign_id UUID,
    p_auto_promote BOOLEAN DEFAULT false
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_campaign RECORD;
    v_student RECORD;
    v_eligibility JSONB;
    v_processed_count INTEGER := 0;
    v_promoted_count INTEGER := 0;
BEGIN
    -- Vérifier que l'utilisateur a les droits
    IF get_current_user_role() != 'admin' THEN
        RAISE EXCEPTION 'Only administrators can process promotion campaigns';
    END IF;
    
    -- Récupérer la campagne
    SELECT * INTO v_campaign FROM public.promotion_campaigns WHERE id = p_campaign_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Promotion campaign not found';
    END IF;
    
    -- Marquer la campagne comme en cours
    UPDATE public.promotion_campaigns 
    SET status = 'in_progress', updated_at = now()
    WHERE id = p_campaign_id;
    
    -- Traiter chaque étudiant de l'année source
    FOR v_student IN 
        SELECT s.* FROM public.students s 
        WHERE s.current_academic_year_id = v_campaign.source_academic_year_id
        AND s.status = 'active'
    LOOP
        -- Calculer l'éligibilité
        SELECT public.calculate_student_promotion_eligibility(
            v_student.id, 
            v_campaign.source_academic_year_id
        ) INTO v_eligibility;
        
        -- Insérer ou mettre à jour l'évaluation
        INSERT INTO public.student_promotion_evaluations (
            campaign_id, student_id, 
            calculated_average, criteria_met,
            promotion_decision
        ) VALUES (
            p_campaign_id, v_student.id,
            (v_eligibility->'student_data'->>'overall_average')::DECIMAL,
            v_eligibility->'criteria_results',
            CASE 
                WHEN (v_eligibility->>'overall_eligible')::BOOLEAN THEN 'promoted'
                ELSE 'repeat'
            END
        )
        ON CONFLICT (campaign_id, student_id) 
        DO UPDATE SET
            calculated_average = EXCLUDED.calculated_average,
            criteria_met = EXCLUDED.criteria_met,
            promotion_decision = EXCLUDED.promotion_decision,
            updated_at = now();
        
        v_processed_count := v_processed_count + 1;
        
        -- Si promotion automatique et étudiant éligible
        IF p_auto_promote AND (v_eligibility->>'overall_eligible')::BOOLEAN THEN
            UPDATE public.students 
            SET current_academic_year_id = v_campaign.target_academic_year_id
            WHERE id = v_student.id;
            
            v_promoted_count := v_promoted_count + 1;
        END IF;
    END LOOP;
    
    -- Marquer la campagne comme terminée
    UPDATE public.promotion_campaigns 
    SET status = 'completed', completed_at = now(), updated_at = now()
    WHERE id = p_campaign_id;
    
    RETURN jsonb_build_object(
        'campaign_id', p_campaign_id,
        'processed_students', v_processed_count,
        'promoted_students', v_promoted_count,
        'completed_at', now()
    );
END;
$$;

-- Triggers pour les timestamps
CREATE TRIGGER update_promotion_campaigns_updated_at
    BEFORE UPDATE ON public.promotion_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotion_criteria_updated_at
    BEFORE UPDATE ON public.promotion_criteria
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_promotion_evaluations_updated_at
    BEFORE UPDATE ON public.student_promotion_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();