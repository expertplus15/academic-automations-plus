-- Phase 1 RH Module: Création des tables de base

-- Table des profils enseignants
CREATE TABLE public.teacher_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_number varchar(50) UNIQUE NOT NULL,
  hire_date date NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
  phone varchar(20),
  emergency_contact_name varchar(100),
  emergency_contact_phone varchar(20),
  address text,
  qualification_level varchar(50),
  years_experience integer DEFAULT 0,
  national_id varchar(50),
  social_security_number varchar(50),
  bank_details jsonb DEFAULT '{}',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table des types de contrats
CREATE TABLE public.contract_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(100) NOT NULL,
  code varchar(20) UNIQUE NOT NULL,
  description text,
  is_permanent boolean DEFAULT false,
  default_duration_months integer,
  requires_renewal boolean DEFAULT false,
  salary_type varchar(50) DEFAULT 'monthly' CHECK (salary_type IN ('hourly', 'monthly', 'annual', 'per_session')),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table des contrats
CREATE TABLE public.teacher_contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  contract_type_id uuid NOT NULL REFERENCES public.contract_types(id),
  contract_number varchar(50) UNIQUE NOT NULL,
  start_date date NOT NULL,
  end_date date,
  salary_amount numeric(10,2) NOT NULL,
  working_hours_per_week integer DEFAULT 35,
  status varchar(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired', 'terminated', 'suspended')),
  signed_date date,
  renewal_date date,
  termination_reason text,
  contract_terms jsonb DEFAULT '{}',
  benefits jsonb DEFAULT '{}',
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table des spécialités/compétences
CREATE TABLE public.teacher_specialties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(100) NOT NULL,
  code varchar(20) UNIQUE NOT NULL,
  description text,
  category varchar(50) DEFAULT 'academic' CHECK (category IN ('academic', 'technical', 'language', 'certification')),
  level varchar(50) DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  requires_certification boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table de liaison enseignants-spécialités
CREATE TABLE public.teacher_specialty_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  specialty_id uuid NOT NULL REFERENCES public.teacher_specialties(id) ON DELETE CASCADE,
  proficiency_level varchar(50) DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  certified boolean DEFAULT false,
  certification_date date,
  certification_expiry date,
  notes text,
  assigned_at timestamp with time zone DEFAULT now(),
  UNIQUE(teacher_id, specialty_id)
);

-- Table des disponibilités
CREATE TABLE public.teacher_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_recurring boolean DEFAULT true,
  specific_date date,
  availability_type varchar(50) DEFAULT 'available' CHECK (availability_type IN ('available', 'preferred', 'unavailable')),
  reason text,
  priority integer DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Table des évaluations de performance
CREATE TABLE public.teacher_evaluations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  evaluator_id uuid NOT NULL REFERENCES public.profiles(id),
  evaluation_period_start date NOT NULL,
  evaluation_period_end date NOT NULL,
  overall_rating integer CHECK (overall_rating BETWEEN 1 AND 5),
  teaching_quality_rating integer CHECK (teaching_quality_rating BETWEEN 1 AND 5),
  punctuality_rating integer CHECK (punctuality_rating BETWEEN 1 AND 5),
  student_feedback_rating integer CHECK (student_feedback_rating BETWEEN 1 AND 5),
  collaboration_rating integer CHECK (collaboration_rating BETWEEN 1 AND 5),
  strengths text,
  areas_for_improvement text,
  action_plan text,
  goals_next_period text,
  comments text,
  status varchar(50) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'reviewed', 'approved')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT valid_evaluation_period CHECK (evaluation_period_start <= evaluation_period_end)
);

-- Index pour améliorer les performances
CREATE INDEX idx_teacher_profiles_status ON public.teacher_profiles(status);
CREATE INDEX idx_teacher_profiles_employee_number ON public.teacher_profiles(employee_number);
CREATE INDEX idx_teacher_contracts_teacher_id ON public.teacher_contracts(teacher_id);
CREATE INDEX idx_teacher_contracts_status ON public.teacher_contracts(status);
CREATE INDEX idx_teacher_availability_teacher_id ON public.teacher_availability(teacher_id);
CREATE INDEX idx_teacher_availability_day_time ON public.teacher_availability(day_of_week, start_time, end_time);
CREATE INDEX idx_teacher_evaluations_teacher_id ON public.teacher_evaluations(teacher_id);

-- Triggers pour updated_at
CREATE TRIGGER update_teacher_profiles_updated_at
  BEFORE UPDATE ON public.teacher_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contract_types_updated_at
  BEFORE UPDATE ON public.contract_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_contracts_updated_at
  BEFORE UPDATE ON public.teacher_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_specialties_updated_at
  BEFORE UPDATE ON public.teacher_specialties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_availability_updated_at
  BEFORE UPDATE ON public.teacher_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_evaluations_updated_at
  BEFORE UPDATE ON public.teacher_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_specialty_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_evaluations ENABLE ROW LEVEL SECURITY;

-- Policies pour teacher_profiles
CREATE POLICY "HR staff can manage teacher profiles" ON public.teacher_profiles
  FOR ALL TO authenticated
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Teachers can view own profile" ON public.teacher_profiles
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour contract_types
CREATE POLICY "HR staff can manage contract types" ON public.contract_types
  FOR ALL TO authenticated
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Authenticated users can view contract types" ON public.contract_types
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Policies pour teacher_contracts
CREATE POLICY "HR staff can manage contracts" ON public.teacher_contracts
  FOR ALL TO authenticated
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Teachers can view own contracts" ON public.teacher_contracts
  FOR SELECT TO authenticated
  USING (teacher_id IN (SELECT id FROM public.teacher_profiles WHERE profile_id = auth.uid()) 
         OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour teacher_specialties
CREATE POLICY "HR staff can manage specialties" ON public.teacher_specialties
  FOR ALL TO authenticated
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Authenticated users can view specialties" ON public.teacher_specialties
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Policies pour teacher_specialty_assignments
CREATE POLICY "HR staff can manage specialty assignments" ON public.teacher_specialty_assignments
  FOR ALL TO authenticated
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Teachers can view own specialty assignments" ON public.teacher_specialty_assignments
  FOR SELECT TO authenticated
  USING (teacher_id IN (SELECT id FROM public.teacher_profiles WHERE profile_id = auth.uid()) 
         OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour teacher_availability
CREATE POLICY "HR staff can manage availability" ON public.teacher_availability
  FOR ALL TO authenticated
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Teachers can manage own availability" ON public.teacher_availability
  FOR ALL TO authenticated
  USING (teacher_id IN (SELECT id FROM public.teacher_profiles WHERE profile_id = auth.uid()) 
         OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour teacher_evaluations
CREATE POLICY "HR staff can manage evaluations" ON public.teacher_evaluations
  FOR ALL TO authenticated
  USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Teachers can view own evaluations" ON public.teacher_evaluations
  FOR SELECT TO authenticated
  USING (teacher_id IN (SELECT id FROM public.teacher_profiles WHERE profile_id = auth.uid()) 
         OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Insérer quelques types de contrats par défaut
INSERT INTO public.contract_types (name, code, description, is_permanent, salary_type) VALUES
('CDI - Temps plein', 'CDI_FT', 'Contrat à durée indéterminée temps plein', true, 'monthly'),
('CDD - Temps plein', 'CDD_FT', 'Contrat à durée déterminée temps plein', false, 'monthly'),
('Vacation', 'VAC', 'Contrat de vacation', false, 'hourly'),
('Stage', 'STAGE', 'Convention de stage', false, 'monthly');

-- Insérer quelques spécialités par défaut
INSERT INTO public.teacher_specialties (name, code, description, category, level) VALUES
('Mathématiques', 'MATH', 'Enseignement des mathématiques', 'academic', 'intermediate'),
('Informatique', 'INFO', 'Informatique et programmation', 'technical', 'advanced'),
('Anglais', 'ENG', 'Langue anglaise', 'language', 'intermediate'),
('Français', 'FR', 'Langue française', 'language', 'intermediate'),
('Gestion de projet', 'PM', 'Management de projet', 'technical', 'advanced');