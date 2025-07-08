-- Phase 1: Infrastructure Critique - Tables HR et amélioration eLearning

-- Tables pour le module HR
CREATE TABLE public.teacher_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_number VARCHAR UNIQUE NOT NULL DEFAULT 'EMP' || extract(year from now()) || LPAD(floor(random() * 1000)::text, 3, '0'),
  department_id UUID REFERENCES public.departments(id),
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  specialties JSONB DEFAULT '[]',
  qualifications JSONB DEFAULT '[]',
  phone VARCHAR,
  emergency_contact JSONB DEFAULT '{}',
  salary_grade VARCHAR,
  office_location VARCHAR,
  bio TEXT,
  cv_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

CREATE TABLE public.teacher_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_profile_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  contract_type VARCHAR NOT NULL DEFAULT 'permanent' CHECK (contract_type IN ('permanent', 'temporary', 'part_time', 'consultant')),
  start_date DATE NOT NULL,
  end_date DATE,
  weekly_hours NUMERIC(4,2) NOT NULL DEFAULT 35.00,
  hourly_rate NUMERIC(10,2),
  monthly_salary NUMERIC(10,2),
  status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated', 'pending')),
  contract_terms JSONB DEFAULT '{}',
  signed_date DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.performance_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_profile_id UUID NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  evaluator_id UUID NOT NULL REFERENCES public.profiles(id),
  evaluation_period_start DATE NOT NULL,
  evaluation_period_end DATE NOT NULL,
  overall_score NUMERIC(3,2) CHECK (overall_score >= 0 AND overall_score <= 5),
  criteria_scores JSONB NOT NULL DEFAULT '{}',
  strengths TEXT,
  areas_for_improvement TEXT,
  goals_next_period TEXT,
  status VARCHAR NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'approved')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Amélioration des tables eLearning existantes
-- Ajout de colonnes manquantes à la table courses si elles n'existent pas
DO $$
BEGIN
  -- Vérifier et ajouter les colonnes manquantes une par une
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'code') THEN
    ALTER TABLE public.courses ADD COLUMN code VARCHAR UNIQUE;
    UPDATE public.courses SET code = 'COURSE-' || SUBSTRING(id::TEXT FROM 1 FOR 8) WHERE code IS NULL;
    ALTER TABLE public.courses ALTER COLUMN code SET NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'duration_hours') THEN
    ALTER TABLE public.courses ADD COLUMN duration_hours INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'max_students') THEN
    ALTER TABLE public.courses ADD COLUMN max_students INTEGER DEFAULT 50;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'difficulty_level') THEN
    ALTER TABLE public.courses ADD COLUMN difficulty_level VARCHAR DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'language') THEN
    ALTER TABLE public.courses ADD COLUMN language VARCHAR DEFAULT 'fr';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'prerequisites') THEN
    ALTER TABLE public.courses ADD COLUMN prerequisites JSONB DEFAULT '[]';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'learning_objectives') THEN
    ALTER TABLE public.courses ADD COLUMN learning_objectives JSONB DEFAULT '[]';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_featured') THEN
    ALTER TABLE public.courses ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'enrollment_start_date') THEN
    ALTER TABLE public.courses ADD COLUMN enrollment_start_date DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'enrollment_end_date') THEN
    ALTER TABLE public.courses ADD COLUMN enrollment_end_date DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'course_start_date') THEN
    ALTER TABLE public.courses ADD COLUMN course_start_date DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'course_end_date') THEN
    ALTER TABLE public.courses ADD COLUMN course_end_date DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'price') THEN
    ALTER TABLE public.courses ADD COLUMN price NUMERIC(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'thumbnail_url') THEN
    ALTER TABLE public.courses ADD COLUMN thumbnail_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'status') THEN
    ALTER TABLE public.courses ADD COLUMN status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- RLS Policies pour HR
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_evaluations ENABLE ROW LEVEL SECURITY;

-- Policies pour teacher_profiles
CREATE POLICY "HR staff can manage teacher profiles" ON public.teacher_profiles
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Teachers can view own profile" ON public.teacher_profiles
  FOR SELECT USING (profile_id = auth.uid() OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour teacher_contracts
CREATE POLICY "HR staff can manage contracts" ON public.teacher_contracts
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Teachers can view own contracts" ON public.teacher_contracts
  FOR SELECT USING (teacher_profile_id IN (SELECT id FROM public.teacher_profiles WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour performance_evaluations
CREATE POLICY "HR staff can manage evaluations" ON public.performance_evaluations
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Teachers can view own evaluations" ON public.performance_evaluations
  FOR SELECT USING (teacher_profile_id IN (SELECT id FROM public.teacher_profiles WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Triggers pour updated_at
CREATE TRIGGER update_teacher_profiles_updated_at
  BEFORE UPDATE ON public.teacher_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_contracts_updated_at
  BEFORE UPDATE ON public.teacher_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_evaluations_updated_at
  BEFORE UPDATE ON public.performance_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();