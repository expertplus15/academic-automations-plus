-- ========================================
-- CRÉATION DU SCHÉMA COMPLET SUPABASE
-- ========================================

-- 1. CRÉATION DES ENUMS
CREATE TYPE public.user_role AS ENUM ('admin', 'teacher', 'student', 'hr', 'finance');
CREATE TYPE public.student_status AS ENUM ('active', 'suspended', 'graduated', 'dropped');

-- 2. CRÉATION DES TABLES PRINCIPALES

-- Table departments (départements)
CREATE TABLE public.departments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    head_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table profiles (profils utilisateurs)
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    phone TEXT,
    department_id UUID REFERENCES public.departments(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table programs (programmes d'études)
CREATE TABLE public.programs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    duration_years INTEGER NOT NULL DEFAULT 3,
    department_id UUID NOT NULL REFERENCES public.departments(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table courses (cours)
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 3,
    description TEXT,
    program_id UUID NOT NULL REFERENCES public.programs(id),
    semester INTEGER NOT NULL DEFAULT 1,
    year_level INTEGER NOT NULL DEFAULT 1,
    teacher_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table students (étudiants)
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_number TEXT NOT NULL UNIQUE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id),
    year_level INTEGER NOT NULL DEFAULT 1,
    status student_status NOT NULL DEFAULT 'active',
    enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. AJOUT DE LA CONTRAINTE FOREIGN KEY POUR HEAD_ID
ALTER TABLE public.departments 
ADD CONSTRAINT departments_head_id_fkey 
FOREIGN KEY (head_id) REFERENCES public.profiles(id);

-- 4. ACTIVATION DE RLS SUR TOUTES LES TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 5. CRÉATION DES POLICIES RLS

-- Policies pour profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'hr')
        )
    );

CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Policies pour students
CREATE POLICY "Students can view own data" ON public.students
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Admins and HR can view all students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'hr')
        )
    );

CREATE POLICY "Admins and HR can manage students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'hr')
        )
    );

-- Policies pour departments (lecture publique pour les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can view departments" ON public.departments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage departments" ON public.departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Policies pour programs (lecture publique pour les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can view programs" ON public.programs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage programs" ON public.programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Policies pour courses
CREATE POLICY "Authenticated users can view courses" ON public.courses
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers can view their courses" ON public.courses
    FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Admins can manage courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'teacher')
        )
    );

-- 6. FONCTION POUR METTRE À JOUR updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. TRIGGERS POUR updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON public.departments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON public.programs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. FONCTION POUR CRÉER AUTOMATIQUEMENT UN PROFIL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. TRIGGER POUR CRÉATION AUTOMATIQUE DU PROFIL
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 10. DONNÉES INITIALES (DÉPARTEMENTS ET PROGRAMMES D'EXEMPLE)
INSERT INTO public.departments (name, code) VALUES
    ('Informatique', 'INFO'),
    ('Génie Civil', 'GC'),
    ('Administration', 'ADMIN'),
    ('Mathématiques', 'MATH'),
    ('Langues', 'LANG');

INSERT INTO public.programs (name, code, description, duration_years, department_id) VALUES
    ('Informatique de Gestion', 'IG', 'Programme de formation en informatique appliquée à la gestion', 3, 
        (SELECT id FROM public.departments WHERE code = 'INFO')),
    ('Génie Logiciel', 'GL', 'Programme de formation en développement logiciel', 3, 
        (SELECT id FROM public.departments WHERE code = 'INFO')),
    ('Génie Civil', 'GC', 'Programme de formation en génie civil et construction', 4, 
        (SELECT id FROM public.departments WHERE code = 'GC')),
    ('Gestion des Entreprises', 'GE', 'Programme de formation en administration des affaires', 3, 
        (SELECT id FROM public.departments WHERE code = 'ADMIN'));

-- 11. FONCTION UTILITAIRE POUR GÉNÉRER NUMÉRO ÉTUDIANT
CREATE OR REPLACE FUNCTION public.generate_student_number(program_code TEXT, enrollment_year INTEGER)
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    next_sequence INTEGER;
    new_number TEXT;
BEGIN
    -- Extraire les 2 derniers chiffres de l'année
    year_suffix := RIGHT(enrollment_year::TEXT, 2);
    
    -- Trouver le prochain numéro de séquence
    SELECT COALESCE(MAX(
        CAST(RIGHT(student_number, 3) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM public.students
    WHERE student_number LIKE (program_code || year_suffix || '%');
    
    -- Construire le nouveau numéro
    new_number := program_code || year_suffix || LPAD(next_sequence::TEXT, 3, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;