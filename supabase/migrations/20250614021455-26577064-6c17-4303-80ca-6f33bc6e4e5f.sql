-- Academic Module Database Schema Extension
-- Phase 1: Create comprehensive academic tables

-- Academic levels (DUT, Licence, Master, Doctorat)
CREATE TABLE public.academic_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL UNIQUE,
  education_cycle VARCHAR(50) NOT NULL CHECK (education_cycle IN ('short', 'bachelor', 'master', 'doctorate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subjects/Unités d'enseignement
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  credits_ects INTEGER NOT NULL CHECK (credits_ects > 0),
  coefficient DECIMAL(4,2) NOT NULL DEFAULT 1.0,
  hours_theory INTEGER DEFAULT 0 CHECK (hours_theory >= 0),
  hours_practice INTEGER DEFAULT 0 CHECK (hours_practice >= 0),
  hours_project INTEGER DEFAULT 0 CHECK (hours_project >= 0),
  prerequisites JSONB DEFAULT '[]'::jsonb,
  teaching_methods JSONB DEFAULT '[]'::jsonb,
  evaluation_methods JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Specializations (filières et parcours)
CREATE TABLE public.specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  credits_required INTEGER,
  is_mandatory BOOLEAN DEFAULT false,
  max_students INTEGER,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(program_id, code)
);

-- Program-Subject relationship
CREATE TABLE public.program_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL CHECK (semester > 0),
  is_mandatory BOOLEAN DEFAULT true,
  min_grade_to_pass DECIMAL(4,2) DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(program_id, subject_id, semester)
);

-- Academic years
CREATE TABLE public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK (end_date > start_date)
);

-- Rooms
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  building VARCHAR(100),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('classroom', 'lab', 'amphitheater', 'conference')),
  equipment JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'unavailable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Class groups
CREATE TABLE public.class_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  max_students INTEGER NOT NULL CHECK (max_students > 0),
  current_students INTEGER DEFAULT 0 CHECK (current_students >= 0),
  group_type VARCHAR(20) NOT NULL CHECK (group_type IN ('main', 'td', 'tp')),
  parent_group_id UUID REFERENCES public.class_groups(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(academic_year_id, code),
  CHECK (current_students <= max_students)
);

-- Timetables
CREATE TABLE public.timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id),
  room_id UUID REFERENCES public.rooms(id),
  group_id UUID REFERENCES public.class_groups(id),
  day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_type VARCHAR(20) NOT NULL CHECK (slot_type IN ('theory', 'practice', 'lab', 'project')),
  recurrence_pattern JSONB DEFAULT '{}'::jsonb,
  exceptions JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK (end_time > start_time)
);

-- Academic calendar
CREATE TABLE public.academic_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('semester', 'holiday', 'exam', 'registration', 'other')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  affects_programs JSONB DEFAULT '[]'::jsonb,
  is_holiday BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK (end_date >= start_date)
);

-- Add level_id to programs table
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS level_id UUID REFERENCES public.academic_levels(id);

-- Performance indexes
CREATE INDEX idx_timetables_schedule ON public.timetables(academic_year_id, day_of_week, start_time);
CREATE INDEX idx_program_subjects_lookup ON public.program_subjects(program_id, semester);
CREATE INDEX idx_subjects_search ON public.subjects USING gin(to_tsvector('french', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_calendar_dates ON public.academic_calendar(start_date, end_date);
CREATE INDEX idx_class_groups_program ON public.class_groups(program_id, academic_year_id);
CREATE INDEX idx_timetables_teacher ON public.timetables(teacher_id, day_of_week, start_time);
CREATE INDEX idx_timetables_room ON public.timetables(room_id, day_of_week, start_time);

-- Functions
CREATE OR REPLACE FUNCTION public.generate_unique_code(prefix TEXT, table_name TEXT, column_name TEXT)
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := prefix || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        EXECUTE FORMAT('SELECT EXISTS(SELECT 1 FROM %I WHERE %I = $1)', table_name, column_name)
        INTO code_exists
        USING new_code;
        EXIT WHEN NOT code_exists;
    END LOOP;
    RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for updating current_students in class_groups
CREATE OR REPLACE FUNCTION public.update_class_group_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.class_groups 
        SET current_students = current_students + 1 
        WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.class_groups 
        SET current_students = current_students - 1 
        WHERE id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables
ALTER TABLE public.academic_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;

-- RLS Policies using the existing security definer function
CREATE POLICY "Authenticated users can view academic levels" ON public.academic_levels FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage academic levels" ON public.academic_levels FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Authenticated users can view subjects" ON public.subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and teachers can manage subjects" ON public.subjects FOR ALL USING (public.get_current_user_role() IN ('admin', 'teacher'));

CREATE POLICY "Authenticated users can view specializations" ON public.specializations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage specializations" ON public.specializations FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Authenticated users can view program subjects" ON public.program_subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage program subjects" ON public.program_subjects FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Authenticated users can view academic years" ON public.academic_years FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage academic years" ON public.academic_years FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Authenticated users can view rooms" ON public.rooms FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage rooms" ON public.rooms FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Authenticated users can view class groups" ON public.class_groups FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and teachers can manage class groups" ON public.class_groups FOR ALL USING (public.get_current_user_role() IN ('admin', 'teacher'));

CREATE POLICY "Authenticated users can view timetables" ON public.timetables FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and teachers can manage timetables" ON public.timetables FOR ALL USING (public.get_current_user_role() IN ('admin', 'teacher'));

CREATE POLICY "Authenticated users can view academic calendar" ON public.academic_calendar FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage academic calendar" ON public.academic_calendar FOR ALL USING (public.get_current_user_role() = 'admin');

-- Insert default academic levels
INSERT INTO public.academic_levels (code, name, order_index, education_cycle) VALUES
('DUT', 'Diplôme Universitaire de Technologie', 1, 'short'),
('L1', 'Licence 1ère année', 2, 'bachelor'),
('L2', 'Licence 2ème année', 3, 'bachelor'),
('L3', 'Licence 3ème année', 4, 'bachelor'),
('M1', 'Master 1ère année', 5, 'master'),
('M2', 'Master 2ème année', 6, 'master'),
('D1', 'Doctorat 1ère année', 7, 'doctorate'),
('D2', 'Doctorat 2ème année', 8, 'doctorate'),
('D3', 'Doctorat 3ème année', 9, 'doctorate');

-- Insert current academic year
INSERT INTO public.academic_years (name, start_date, end_date, is_current, status) VALUES
('2024-2025', '2024-09-01', '2025-08-31', true, 'active');

-- Update triggers for timestamps
CREATE TRIGGER update_academic_levels_updated_at BEFORE UPDATE ON public.academic_levels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_specializations_updated_at BEFORE UPDATE ON public.specializations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON public.academic_years FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_class_groups_updated_at BEFORE UPDATE ON public.class_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON public.timetables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_academic_calendar_updated_at BEFORE UPDATE ON public.academic_calendar FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();