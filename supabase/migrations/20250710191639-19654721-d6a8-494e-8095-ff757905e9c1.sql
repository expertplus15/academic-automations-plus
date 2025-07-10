-- Create transport_reservations table
CREATE TABLE public.transport_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  line_id UUID NOT NULL,
  reservation_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  pickup_stop TEXT NOT NULL,
  destination_stop TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transport_schedules table for detailed timetables
CREATE TABLE public.transport_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  stops JSONB NOT NULL DEFAULT '[]', -- Array of stops with times
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transport_subscriptions table
CREATE TABLE public.transport_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  line_id UUID NOT NULL,
  subscription_type TEXT NOT NULL, -- 'weekly', 'monthly', 'semester'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transport_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transport_reservations
CREATE POLICY "Students can view their own reservations" 
ON public.transport_reservations 
FOR SELECT 
USING (student_id IN (
  SELECT id FROM students WHERE profile_id = auth.uid()
) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Students can create their own reservations" 
ON public.transport_reservations 
FOR INSERT 
WITH CHECK (student_id IN (
  SELECT id FROM students WHERE profile_id = auth.uid()
) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Students can update their own reservations" 
ON public.transport_reservations 
FOR UPDATE 
USING (student_id IN (
  SELECT id FROM students WHERE profile_id = auth.uid()
) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- RLS Policies for transport_schedules
CREATE POLICY "Anyone can view transport schedules" 
ON public.transport_schedules 
FOR SELECT 
USING (is_active = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Only staff can manage schedules" 
ON public.transport_schedules 
FOR ALL 
USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- RLS Policies for transport_subscriptions
CREATE POLICY "Students can view their own subscriptions" 
ON public.transport_subscriptions 
FOR SELECT 
USING (student_id IN (
  SELECT id FROM students WHERE profile_id = auth.uid()
) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Students can create their own subscriptions" 
ON public.transport_subscriptions 
FOR INSERT 
WITH CHECK (student_id IN (
  SELECT id FROM students WHERE profile_id = auth.uid()
) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Add some sample data to transport_lines
INSERT INTO public.transport_lines (name, code, description, route_data, schedule, price, is_active) VALUES
('Ligne A - Centre Ville', 'LN-A', 'Dessert le centre-ville et les quartiers résidentiels', 
'[
  {"stop": "Université", "coordinates": [2.3522, 48.8566], "time": "07:30"},
  {"stop": "Place de la République", "coordinates": [2.3631, 48.8677], "time": "07:45"},
  {"stop": "Gare Centrale", "coordinates": [2.3486, 48.8534], "time": "08:00"},
  {"stop": "Centre Commercial", "coordinates": [2.3701, 48.8589], "time": "08:15"}
]',
'{"weekdays": ["07:30", "12:30", "17:30"], "weekends": ["09:00", "15:00"]}',
2.50, true),

('Ligne B - Banlieue Nord', 'LN-B', 'Dessert les quartiers nord de la ville',
'[
  {"stop": "Université", "coordinates": [2.3522, 48.8566], "time": "07:45"},
  {"stop": "Quartier Nord", "coordinates": [2.3423, 48.8734], "time": "08:00"},
  {"stop": "Zone Industrielle", "coordinates": [2.3289, 48.8801], "time": "08:20"},
  {"stop": "Terminus Nord", "coordinates": [2.3156, 48.8867], "time": "08:35"}
]',
'{"weekdays": ["07:45", "12:45", "17:45"], "weekends": ["09:15", "15:15"]}',
3.00, true),

('Ligne C - Campus Universitaire', 'LN-C', 'Navette campus avec tous les bâtiments universitaires',
'[
  {"stop": "Entrée Principale", "coordinates": [2.3522, 48.8566], "time": "08:00"},
  {"stop": "Bibliothèque", "coordinates": [2.3534, 48.8578], "time": "08:05"},
  {"stop": "Laboratoires", "coordinates": [2.3567, 48.8589], "time": "08:10"},
  {"stop": "Résidences Étudiantes", "coordinates": [2.3601, 48.8601], "time": "08:15"}
]',
'{"weekdays": ["08:00", "10:00", "14:00", "16:00", "18:00"], "weekends": []}',
1.50, true);

-- Add sample schedules
INSERT INTO public.transport_schedules (line_id, day_of_week, departure_time, arrival_time, stops) 
SELECT 
  tl.id,
  generate_series(1, 5) as day_of_week, -- Monday to Friday
  '07:30'::TIME as departure_time,
  '08:35'::TIME as arrival_time,
  tl.route_data as stops
FROM public.transport_lines tl 
WHERE tl.code = 'LN-A';

-- Create triggers for updated_at
CREATE TRIGGER update_transport_reservations_updated_at
  BEFORE UPDATE ON public.transport_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_schedules_updated_at
  BEFORE UPDATE ON public.transport_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transport_subscriptions_updated_at
  BEFORE UPDATE ON public.transport_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();