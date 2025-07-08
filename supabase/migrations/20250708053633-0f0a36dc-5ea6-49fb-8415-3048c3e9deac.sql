-- Phase 1: Infrastructure Critique - Tables HR et eLearning

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

-- Tables pour le module eLearning
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id),
  category_id UUID REFERENCES public.course_categories(id),
  title VARCHAR NOT NULL,
  description TEXT,
  code VARCHAR UNIQUE NOT NULL,
  duration_hours INTEGER,
  max_students INTEGER DEFAULT 50,
  difficulty_level VARCHAR DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  language VARCHAR DEFAULT 'fr',
  prerequisites JSONB DEFAULT '[]',
  learning_objectives JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  enrollment_start_date DATE,
  enrollment_end_date DATE,
  course_start_date DATE,
  course_end_date DATE,
  price NUMERIC(10,2) DEFAULT 0,
  thumbnail_url TEXT,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE,
  progress_percentage NUMERIC(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  final_grade NUMERIC(5,2),
  status VARCHAR NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'suspended')),
  payment_status VARCHAR DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, student_id)
);

CREATE TABLE public.virtual_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id),
  title VARCHAR NOT NULL,
  description TEXT,
  platform VARCHAR NOT NULL DEFAULT 'zoom' CHECK (platform IN ('zoom', 'teams', 'meet', 'webex')),
  meeting_id VARCHAR,
  meeting_url TEXT,
  password VARCHAR,
  scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER DEFAULT 50,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB DEFAULT '{}',
  recording_enabled BOOLEAN DEFAULT true,
  auto_record BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.forums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  is_general BOOLEAN DEFAULT false,
  is_moderated BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

-- RLS Policies pour eLearning
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;

-- Policies pour courses
CREATE POLICY "Instructors can manage own courses" ON public.courses
  FOR ALL USING (instructor_id = auth.uid() OR get_current_user_role() = 'admin'::user_role);

CREATE POLICY "Users can view published courses" ON public.courses
  FOR SELECT USING (is_published = true OR instructor_id = auth.uid() OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Policies pour course_enrollments
CREATE POLICY "Students can manage own enrollments" ON public.course_enrollments
  FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Policies pour virtual_sessions
CREATE POLICY "Instructors can manage sessions" ON public.virtual_sessions
  FOR ALL USING (instructor_id = auth.uid() OR get_current_user_role() = 'admin'::user_role);

CREATE POLICY "Users can view sessions of accessible courses" ON public.virtual_sessions
  FOR SELECT USING (course_id IN (SELECT id FROM courses WHERE is_published = true OR instructor_id = auth.uid()) OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Policies pour forums
CREATE POLICY "Staff can manage forums" ON public.forums
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Users can view accessible forums" ON public.forums
  FOR SELECT USING (is_general = true OR course_id IN (SELECT ce.course_id FROM course_enrollments ce JOIN students s ON s.id = ce.student_id WHERE s.profile_id = auth.uid()) OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'teacher'::user_role]));

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

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_virtual_sessions_updated_at
  BEFORE UPDATE ON public.virtual_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forums_updated_at
  BEFORE UPDATE ON public.forums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();