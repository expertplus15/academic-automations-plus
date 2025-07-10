-- Tables pour le module Orientation & Carrière

-- Table des rendez-vous carrière
CREATE TABLE public.career_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  counselor_id UUID,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  appointment_type VARCHAR NOT NULL DEFAULT 'orientation',
  status VARCHAR NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des offres d'emploi
CREATE TABLE public.job_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name VARCHAR NOT NULL,
  job_title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB DEFAULT '[]'::jsonb,
  salary_range VARCHAR,
  location VARCHAR,
  job_type VARCHAR NOT NULL DEFAULT 'full_time',
  contract_type VARCHAR NOT NULL DEFAULT 'cdi',
  application_deadline DATE,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  is_published BOOLEAN NOT NULL DEFAULT false,
  posted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des tests d'orientation
CREATE TABLE public.career_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  test_type VARCHAR NOT NULL,
  test_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  results JSONB,
  completion_date TIMESTAMP WITH TIME ZONE,
  score NUMERIC,
  recommendations TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des ressources carrière
CREATE TABLE public.career_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  resource_type VARCHAR NOT NULL DEFAULT 'document',
  file_url TEXT,
  external_url TEXT,
  category VARCHAR NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tables pour le module Santé & Bien-être

-- Table des médicaments
CREATE TABLE public.health_medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  medication_name VARCHAR NOT NULL,
  dosage VARCHAR NOT NULL,
  frequency VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  prescribed_by VARCHAR,
  instructions TEXT,
  side_effects TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des contacts d'urgence
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  contact_name VARCHAR NOT NULL,
  relationship VARCHAR NOT NULL,
  phone_primary VARCHAR NOT NULL,
  phone_secondary VARCHAR,
  email VARCHAR,
  address TEXT,
  priority_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des aménagements handicap
CREATE TABLE public.accessibility_accommodations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  accommodation_type VARCHAR NOT NULL,
  description TEXT NOT NULL,
  medical_justification TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR NOT NULL DEFAULT 'active',
  approved_by UUID,
  approval_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des alertes santé
CREATE TABLE public.health_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  alert_type VARCHAR NOT NULL,
  severity VARCHAR NOT NULL DEFAULT 'low',
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  trigger_condition JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.career_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour career_appointments
CREATE POLICY "Students can view their career appointments"
  ON public.career_appointments FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role, 'hr'::user_role]));

CREATE POLICY "Students can create career appointments"
  ON public.career_appointments FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Staff can manage career appointments"
  ON public.career_appointments FOR ALL
  USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role, 'hr'::user_role]));

-- Politiques RLS pour job_offers
CREATE POLICY "Anyone can view published job offers"
  ON public.job_offers FOR SELECT
  USING (is_published = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Staff can manage job offers"
  ON public.job_offers FOR ALL
  USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques RLS pour career_tests
CREATE POLICY "Students can manage their career tests"
  ON public.career_tests FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Politiques RLS pour career_resources
CREATE POLICY "Anyone can view public career resources"
  ON public.career_resources FOR SELECT
  USING (is_public = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can manage career resources"
  ON public.career_resources FOR ALL
  USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Politiques RLS pour health_medications
CREATE POLICY "Students can manage their medications"
  ON public.health_medications FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques RLS pour emergency_contacts
CREATE POLICY "Students can manage their emergency contacts"
  ON public.emergency_contacts FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques RLS pour accessibility_accommodations
CREATE POLICY "Students can view their accommodations"
  ON public.accessibility_accommodations FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Staff can manage accommodations"
  ON public.accessibility_accommodations FOR ALL
  USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques RLS pour health_alerts
CREATE POLICY "Students can view their health alerts"
  ON public.health_alerts FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Staff can manage health alerts"
  ON public.health_alerts FOR ALL
  USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Triggers pour updated_at
CREATE TRIGGER update_career_appointments_updated_at
  BEFORE UPDATE ON public.career_appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_offers_updated_at
  BEFORE UPDATE ON public.job_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_resources_updated_at
  BEFORE UPDATE ON public.career_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_medications_updated_at
  BEFORE UPDATE ON public.health_medications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accessibility_accommodations_updated_at
  BEFORE UPDATE ON public.accessibility_accommodations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_alerts_updated_at
  BEFORE UPDATE ON public.health_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();