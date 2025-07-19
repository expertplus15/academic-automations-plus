
-- Créer la table pour les sessions d'examens groupées
CREATE TABLE public.exam_sessions_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  description TEXT,
  program_id UUID REFERENCES programs(id),
  academic_year_id UUID REFERENCES academic_years(id),
  level VARCHAR,
  semesters JSONB DEFAULT '[]'::jsonb,
  start_date DATE,
  end_date DATE,
  status VARCHAR DEFAULT 'draft'::VARCHAR,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table pour les modalités d'évaluation
CREATE TABLE public.evaluation_modalities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  subject_id UUID REFERENCES subjects(id),
  program_id UUID REFERENCES programs(id),
  continuous_assessment_weight NUMERIC DEFAULT 50.0,
  final_exam_weight NUMERIC DEFAULT 50.0,
  min_cc_evaluations INTEGER DEFAULT 2,
  has_retake_session BOOLEAN DEFAULT true,
  retake_date DATE,
  evaluation_types JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table pour les convocations
CREATE TABLE public.exam_convocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES exam_sessions(id),
  session_group_id UUID REFERENCES exam_sessions_groups(id),
  student_id UUID REFERENCES students(id),
  template_type VARCHAR NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  reminded_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR DEFAULT 'pending'::VARCHAR,
  email_content TEXT,
  convocation_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table pour les templates de convocations
CREATE TABLE public.convocation_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  template_type VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  send_days_before INTEGER DEFAULT 15,
  reminder_days_before INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ajouter une colonne pour lier les sessions aux groupes
ALTER TABLE public.exam_sessions 
ADD COLUMN session_group_id UUID REFERENCES exam_sessions_groups(id);

-- Créer les politiques RLS
ALTER TABLE public.exam_sessions_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_convocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convocation_templates ENABLE ROW LEVEL SECURITY;

-- Politiques pour exam_sessions_groups
CREATE POLICY "Teachers and admins can manage exam session groups" ON public.exam_sessions_groups 
FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Politiques pour evaluation_modalities
CREATE POLICY "Teachers and admins can manage evaluation modalities" ON public.evaluation_modalities 
FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Politiques pour exam_convocations
CREATE POLICY "Students can view their convocations" ON public.exam_convocations 
FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR
  get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Teachers and admins can manage convocations" ON public.exam_convocations 
FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Politiques pour convocation_templates
CREATE POLICY "Teachers and admins can manage templates" ON public.convocation_templates 
FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Insérer des templates de convocations par défaut
INSERT INTO public.convocation_templates (name, template_type, subject, content, variables, send_days_before, reminder_days_before) VALUES
('Convocation Examen Standard', 'exam', 'Convocation - Examen {{exam_title}}', 
'Madame, Monsieur {{student_name}},

Vous êtes convoqué(e) à l''examen de {{exam_title}} qui aura lieu :

📅 Date : {{exam_date}}
⏰ Heure : {{exam_time}}  
📍 Salle : {{exam_room}}
⏱️ Durée : {{exam_duration}}

Matériel autorisé : {{allowed_materials}}

Merci de vous présenter 15 minutes avant le début de l''épreuve avec votre carte d''étudiant.

Cordialement,
Le Service des Examens
Contact : exprh21@gmail.com', 
'["student_name", "exam_title", "exam_date", "exam_time", "exam_room", "exam_duration", "allowed_materials"]'::jsonb, 15, 3),

('Convocation Soutenance', 'oral', 'Convocation - Soutenance {{project_type}}', 
'Madame, Monsieur {{student_name}},

Vous êtes convoqué(e) pour votre soutenance de {{project_type}} :

📅 Date : {{defense_date}}
⏰ Heure : {{defense_time}}
📍 Salle : {{defense_room}}
⏱️ Durée : {{defense_duration}}

Composition du jury :
{{jury_members}}

Matériel mis à disposition : Vidéoprojecteur, ordinateur portable

Merci de vous présenter 15 minutes avant l''heure prévue.

Cordialement,
Le Service des Examens', 
'["student_name", "project_type", "defense_date", "defense_time", "defense_room", "defense_duration", "jury_members"]'::jsonb, 7, 1);

-- Insérer des modalités d'évaluation par défaut
INSERT INTO public.evaluation_modalities (name, code, continuous_assessment_weight, final_exam_weight, min_cc_evaluations, has_retake_session) VALUES
('Standard DUT', 'STD_DUT', 50.0, 50.0, 2, true),
('Contrôle Continu Intégral', 'CCI', 100.0, 0.0, 4, false),
('Examen Terminal', 'TERM', 0.0, 100.0, 0, true),
('Projet + Soutenance', 'PROJ_SOUT', 70.0, 30.0, 1, false);

-- Insérer un exemple de session d'examens
INSERT INTO public.exam_sessions_groups (code, name, description, level, semesters, start_date, end_date, status) VALUES
('S1-2324-DUTGE', 'Session 1 - 2023/2024', 'Session d''examens pour DUT2 Gestion des Entreprises', 'DUT2', '["S3", "S4"]'::jsonb, '2023-09-01', '2024-06-30', 'active');

-- Triggers pour updated_at
CREATE TRIGGER update_exam_sessions_groups_updated_at 
BEFORE UPDATE ON public.exam_sessions_groups 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();

CREATE TRIGGER update_evaluation_modalities_updated_at 
BEFORE UPDATE ON public.evaluation_modalities 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();

CREATE TRIGGER update_exam_convocations_updated_at 
BEFORE UPDATE ON public.exam_convocations 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();

CREATE TRIGGER update_convocation_templates_updated_at 
BEFORE UPDATE ON public.convocation_templates 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_trigger();
