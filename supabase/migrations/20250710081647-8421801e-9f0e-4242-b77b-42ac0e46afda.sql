
-- Phase 1: Infrastructure - Tables pour le module Services aux Étudiants

-- Table pour les lignes de transport
CREATE TABLE public.transport_lines (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    code VARCHAR NOT NULL UNIQUE,
    description TEXT,
    route_data JSONB DEFAULT '[]',
    schedule JSONB DEFAULT '{}',
    price NUMERIC(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les arrêts de transport
CREATE TABLE public.transport_stops (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    code VARCHAR NOT NULL UNIQUE,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    address TEXT,
    facilities JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les réservations de transport
CREATE TABLE public.transport_bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    line_id UUID NOT NULL,
    booking_date DATE NOT NULL,
    departure_stop_id UUID NOT NULL,
    arrival_stop_id UUID NOT NULL,
    departure_time TIME NOT NULL,
    seat_number VARCHAR,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les menus de restauration
CREATE TABLE public.catering_menus (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    menu_date DATE NOT NULL,
    meal_type VARCHAR NOT NULL, -- breakfast, lunch, dinner
    items JSONB DEFAULT '[]',
    price NUMERIC(10,2) NOT NULL,
    nutritional_info JSONB DEFAULT '{}',
    allergens JSONB DEFAULT '[]',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les commandes de restauration
CREATE TABLE public.catering_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    menu_id UUID NOT NULL,
    order_date DATE NOT NULL,
    pickup_time TIME,
    quantity INTEGER DEFAULT 1,
    total_amount NUMERIC(10,2) NOT NULL,
    special_requests TEXT,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les soldes de restauration
CREATE TABLE public.catering_balances (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL UNIQUE,
    balance NUMERIC(10,2) DEFAULT 0,
    last_recharge_amount NUMERIC(10,2),
    last_recharge_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les chambres d'hébergement
CREATE TABLE public.accommodation_rooms (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    building_name VARCHAR NOT NULL,
    room_number VARCHAR NOT NULL,
    room_type VARCHAR NOT NULL, -- single, double, shared
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    monthly_rent NUMERIC(10,2) NOT NULL,
    facilities JSONB DEFAULT '[]',
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les attributions d'hébergement
CREATE TABLE public.accommodation_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    room_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_rent NUMERIC(10,2) NOT NULL,
    deposit_amount NUMERIC(10,2),
    status VARCHAR DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour le catalogue de la bibliothèque
CREATE TABLE public.library_catalog (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    author VARCHAR,
    isbn VARCHAR UNIQUE,
    publisher VARCHAR,
    publication_year INTEGER,
    category VARCHAR NOT NULL,
    description TEXT,
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    location VARCHAR,
    digital_url TEXT,
    is_digital BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les emprunts de bibliothèque
CREATE TABLE public.library_loans (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    book_id UUID NOT NULL,
    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    renewal_count INTEGER DEFAULT 0,
    fine_amount NUMERIC(10,2) DEFAULT 0,
    status VARCHAR DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les activités extra-scolaires
CREATE TABLE public.student_activities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR NOT NULL,
    instructor_name VARCHAR,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    schedule JSONB DEFAULT '{}',
    location VARCHAR,
    registration_fee NUMERIC(10,2) DEFAULT 0,
    required_level VARCHAR,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les inscriptions aux activités
CREATE TABLE public.activity_enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    activity_id UUID NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR DEFAULT 'active',
    payment_status VARCHAR DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les dossiers médicaux
CREATE TABLE public.health_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    blood_type VARCHAR,
    allergies JSONB DEFAULT '[]',
    chronic_conditions JSONB DEFAULT '[]',
    emergency_contact_name VARCHAR,
    emergency_contact_phone VARCHAR,
    doctor_name VARCHAR,
    doctor_phone VARCHAR,
    insurance_number VARCHAR,
    medical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les rendez-vous médicaux
CREATE TABLE public.health_appointments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    doctor_name VARCHAR,
    appointment_type VARCHAR NOT NULL,
    reason TEXT,
    status VARCHAR DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les demandes de services génériques
CREATE TABLE public.service_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    service_type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR DEFAULT 'medium',
    status VARCHAR DEFAULT 'pending',
    assigned_to UUID,
    response TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contraintes de clés étrangères
ALTER TABLE public.transport_bookings ADD CONSTRAINT fk_transport_bookings_student FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.transport_bookings ADD CONSTRAINT fk_transport_bookings_line FOREIGN KEY (line_id) REFERENCES public.transport_lines(id);
ALTER TABLE public.transport_bookings ADD CONSTRAINT fk_transport_bookings_departure FOREIGN KEY (departure_stop_id) REFERENCES public.transport_stops(id);
ALTER TABLE public.transport_bookings ADD CONSTRAINT fk_transport_bookings_arrival FOREIGN KEY (arrival_stop_id) REFERENCES public.transport_stops(id);

ALTER TABLE public.catering_orders ADD CONSTRAINT fk_catering_orders_student FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.catering_orders ADD CONSTRAINT fk_catering_orders_menu FOREIGN KEY (menu_id) REFERENCES public.catering_menus(id);
ALTER TABLE public.catering_balances ADD CONSTRAINT fk_catering_balances_student FOREIGN KEY (student_id) REFERENCES public.students(id);

ALTER TABLE public.accommodation_assignments ADD CONSTRAINT fk_accommodation_assignments_student FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.accommodation_assignments ADD CONSTRAINT fk_accommodation_assignments_room FOREIGN KEY (room_id) REFERENCES public.accommodation_rooms(id);

ALTER TABLE public.library_loans ADD CONSTRAINT fk_library_loans_student FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.library_loans ADD CONSTRAINT fk_library_loans_book FOREIGN KEY (book_id) REFERENCES public.library_catalog(id);

ALTER TABLE public.activity_enrollments ADD CONSTRAINT fk_activity_enrollments_student FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.activity_enrollments ADD CONSTRAINT fk_activity_enrollments_activity FOREIGN KEY (activity_id) REFERENCES public.student_activities(id);

ALTER TABLE public.health_records ADD CONSTRAINT fk_health_records_student FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.health_appointments ADD CONSTRAINT fk_health_appointments_student FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.service_requests ADD CONSTRAINT fk_service_requests_student FOREIGN KEY (student_id) REFERENCES public.students(id);

-- Contraintes uniques
ALTER TABLE public.accommodation_rooms ADD CONSTRAINT uk_accommodation_rooms UNIQUE (building_name, room_number);
ALTER TABLE public.activity_enrollments ADD CONSTRAINT uk_activity_enrollments UNIQUE (student_id, activity_id);
ALTER TABLE public.health_records ADD CONSTRAINT uk_health_records_student UNIQUE (student_id);

-- RLS Policies
ALTER TABLE public.transport_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Policies pour le transport
CREATE POLICY "Anyone can view transport lines" ON public.transport_lines FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view transport stops" ON public.transport_stops FOR SELECT USING (is_active = true);
CREATE POLICY "Students can manage their transport bookings" ON public.transport_bookings FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour la restauration
CREATE POLICY "Anyone can view available menus" ON public.catering_menus FOR SELECT USING (is_available = true);
CREATE POLICY "Students can manage their catering orders" ON public.catering_orders FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));
CREATE POLICY "Students can view their balance" ON public.catering_balances FOR SELECT USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour l'hébergement
CREATE POLICY "Anyone can view available rooms" ON public.accommodation_rooms FOR SELECT USING (is_available = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));
CREATE POLICY "Students can view their accommodation assignments" ON public.accommodation_assignments FOR SELECT USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour la bibliothèque
CREATE POLICY "Anyone can view available books" ON public.library_catalog FOR SELECT USING (is_available = true);
CREATE POLICY "Students can manage their library loans" ON public.library_loans FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Policies pour les activités
CREATE POLICY "Anyone can view active activities" ON public.student_activities FOR SELECT USING (is_active = true);
CREATE POLICY "Students can manage their activity enrollments" ON public.activity_enrollments FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Policies pour la santé
CREATE POLICY "Students can manage their health records" ON public.health_records FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));
CREATE POLICY "Students can manage their health appointments" ON public.health_appointments FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Policies pour les demandes de services
CREATE POLICY "Students can manage their service requests" ON public.service_requests FOR ALL USING (student_id IN (SELECT id FROM students WHERE profile_id = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Triggers pour updated_at
CREATE TRIGGER update_transport_lines_updated_at BEFORE UPDATE ON public.transport_lines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transport_bookings_updated_at BEFORE UPDATE ON public.transport_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_catering_menus_updated_at BEFORE UPDATE ON public.catering_menus FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_catering_orders_updated_at BEFORE UPDATE ON public.catering_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_catering_balances_updated_at BEFORE UPDATE ON public.catering_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accommodation_rooms_updated_at BEFORE UPDATE ON public.accommodation_rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accommodation_assignments_updated_at BEFORE UPDATE ON public.accommodation_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_library_catalog_updated_at BEFORE UPDATE ON public.library_catalog FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_library_loans_updated_at BEFORE UPDATE ON public.library_loans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_activities_updated_at BEFORE UPDATE ON public.student_activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activity_enrollments_updated_at BEFORE UPDATE ON public.activity_enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON public.health_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_appointments_updated_at BEFORE UPDATE ON public.health_appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
