
-- Tables pour le système de suivi académique

-- Types d'évaluations
CREATE TABLE public.evaluation_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    weight_percentage DECIMAL(5,2) DEFAULT 100.00,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notes des étudiants
CREATE TABLE public.student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    evaluation_type_id UUID NOT NULL REFERENCES public.evaluation_types(id),
    grade DECIMAL(5,2) NOT NULL,
    max_grade DECIMAL(5,2) DEFAULT 20.00,
    evaluation_date DATE NOT NULL,
    semester INTEGER NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id),
    teacher_id UUID REFERENCES public.profiles(id),
    comments TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT valid_grade CHECK (grade >= 0 AND grade <= max_grade),
    CONSTRAINT valid_semester CHECK (semester >= 1 AND semester <= 4)
);

-- Enregistrements de présence
CREATE TABLE public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'present',
    justification TEXT,
    is_justified BOOLEAN DEFAULT false,
    recorded_by UUID REFERENCES public.profiles(id),
    academic_year_id UUID REFERENCES public.academic_years(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT valid_status CHECK (status IN ('present', 'absent', 'late', 'excused'))
);

-- Alertes académiques
CREATE TABLE public.academic_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_subject_id UUID REFERENCES public.subjects(id),
    threshold_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    is_read BOOLEAN DEFAULT false,
    acknowledged_by UUID REFERENCES public.profiles(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT valid_alert_type CHECK (alert_type IN ('low_grade', 'failing_subject', 'excessive_absences', 'attendance_drop', 'grade_improvement', 'at_risk'))
);

-- Progression académique des étudiants
CREATE TABLE public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id),
    semester INTEGER NOT NULL,
    overall_average DECIMAL(5,2),
    subject_average DECIMAL(5,2),
    attendance_rate DECIMAL(5,2),
    total_absences INTEGER DEFAULT 0,
    justified_absences INTEGER DEFAULT 0,
    evaluations_count INTEGER DEFAULT 0,
    credits_earned DECIMAL(5,2) DEFAULT 0,
    credits_attempted DECIMAL(5,2) DEFAULT 0,
    gpa DECIMAL(4,2),
    rank_in_class INTEGER,
    total_students_in_class INTEGER,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT valid_semester_progress CHECK (semester >= 1 AND semester <= 4),
    CONSTRAINT valid_rates CHECK (attendance_rate >= 0 AND attendance_rate <= 100)
);

-- Index pour les performances
CREATE INDEX idx_student_grades_student_subject ON public.student_grades(student_id, subject_id);
CREATE INDEX idx_student_grades_academic_year ON public.student_grades(academic_year_id);
CREATE INDEX idx_attendance_student_date ON public.attendance_records(student_id, session_date);
CREATE INDEX idx_academic_alerts_student_active ON public.academic_alerts(student_id, is_active);
CREATE INDEX idx_student_progress_student_year ON public.student_progress(student_id, academic_year_id);

-- Triggers pour mise à jour automatique des timestamps
CREATE TRIGGER update_evaluation_types_updated_at
    BEFORE UPDATE ON public.evaluation_types
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_grades_updated_at
    BEFORE UPDATE ON public.student_grades
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_alerts_updated_at
    BEFORE UPDATE ON public.academic_alerts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at
    BEFORE UPDATE ON public.student_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Données initiales pour les types d'évaluations
INSERT INTO public.evaluation_types (name, code, weight_percentage, description) VALUES
('Contrôle Continu', 'CC', 40.00, 'Évaluations régulières durant le semestre'),
('Devoir Surveillé', 'DS', 25.00, 'Évaluations sur table en classe'),
('Examen Final', 'EF', 35.00, 'Examen de fin de semestre'),
('Projet', 'PROJ', 20.00, 'Projets et travaux pratiques'),
('Oral', 'ORAL', 15.00, 'Présentations et examens oraux'),
('TP', 'TP', 20.00, 'Travaux pratiques et laboratoires');

-- Fonction pour calculer automatiquement la progression
CREATE OR REPLACE FUNCTION public.calculate_student_progress(
    p_student_id UUID,
    p_academic_year_id UUID,
    p_semester INTEGER
) RETURNS void AS $$
DECLARE
    v_overall_avg DECIMAL(5,2);
    v_attendance_rate DECIMAL(5,2);
    v_total_absences INTEGER;
    v_justified_absences INTEGER;
    v_evaluations_count INTEGER;
BEGIN
    -- Calculer la moyenne générale
    SELECT AVG(grade * (max_grade / 20.0))
    INTO v_overall_avg
    FROM public.student_grades
    WHERE student_id = p_student_id 
    AND academic_year_id = p_academic_year_id
    AND semester = p_semester
    AND is_published = true;

    -- Calculer le taux de présence
    SELECT 
        COUNT(*) FILTER (WHERE status = 'absent') as absences,
        COUNT(*) FILTER (WHERE status = 'absent' AND is_justified = true) as justified,
        COUNT(*) as total
    INTO v_total_absences, v_justified_absences, v_evaluations_count
    FROM public.attendance_records
    WHERE student_id = p_student_id 
    AND academic_year_id = p_academic_year_id;

    v_attendance_rate := CASE 
        WHEN v_evaluations_count > 0 THEN 
            ((v_evaluations_count - v_total_absences)::DECIMAL / v_evaluations_count) * 100
        ELSE 100
    END;

    -- Insérer ou mettre à jour la progression
    INSERT INTO public.student_progress (
        student_id, academic_year_id, semester,
        overall_average, attendance_rate, total_absences, 
        justified_absences, evaluations_count, last_calculated_at
    ) VALUES (
        p_student_id, p_academic_year_id, p_semester,
        v_overall_avg, v_attendance_rate, v_total_absences,
        v_justified_absences, v_evaluations_count, now()
    )
    ON CONFLICT (student_id, academic_year_id, semester) 
    DO UPDATE SET
        overall_average = v_overall_avg,
        attendance_rate = v_attendance_rate,
        total_absences = v_total_absences,
        justified_absences = v_justified_absences,
        evaluations_count = v_evaluations_count,
        last_calculated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
