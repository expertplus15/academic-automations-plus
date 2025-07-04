-- Module Patrimoine - Tables principales

-- Table des catégories d'actifs
CREATE TABLE public.asset_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  parent_category_id UUID REFERENCES public.asset_categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des actifs/équipements
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_number VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.asset_categories(id),
  brand VARCHAR,
  model VARCHAR,
  serial_number VARCHAR,
  purchase_date DATE,
  purchase_price NUMERIC(10,2),
  current_value NUMERIC(10,2),
  depreciation_rate NUMERIC(5,2) DEFAULT 10.00,
  location VARCHAR,
  room_id UUID REFERENCES public.rooms(id),
  qr_code VARCHAR UNIQUE,
  warranty_end_date DATE,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired', 'lost')),
  condition_status VARCHAR DEFAULT 'good' CHECK (condition_status IN ('excellent', 'good', 'fair', 'poor')),
  responsible_person_id UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des maintenances
CREATE TABLE public.asset_maintenance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  maintenance_type VARCHAR NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'inspection')),
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  description TEXT NOT NULL,
  cost NUMERIC(10,2),
  performed_by VARCHAR,
  supplier_id UUID REFERENCES public.suppliers(id),
  notes TEXT,
  status VARCHAR DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des réservations
CREATE TABLE public.asset_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES public.assets(id),
  room_id UUID REFERENCES public.rooms(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  purpose TEXT NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_booking_dates CHECK (end_date > start_date)
);

-- Table des commandes/approvisionnements
CREATE TABLE public.procurement_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_number VARCHAR NOT NULL UNIQUE,
  title VARCHAR NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.asset_categories(id),
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  department_id UUID REFERENCES public.departments(id),
  priority VARCHAR DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_cost NUMERIC(10,2),
  budget_category_id UUID REFERENCES public.financial_categories(id),
  supplier_id UUID REFERENCES public.suppliers(id),
  delivery_date DATE,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'ordered', 'delivered', 'rejected')),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des éléments de commande
CREATE TABLE public.procurement_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.procurement_requests(id) ON DELETE CASCADE,
  item_name VARCHAR NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2),
  total_price NUMERIC(10,2),
  specifications TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table du patrimoine immobilier
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_number VARCHAR NOT NULL UNIQUE,
  property_type VARCHAR NOT NULL CHECK (property_type IN ('building', 'land', 'apartment', 'office')),
  name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  surface_area NUMERIC(10,2),
  acquisition_date DATE,
  acquisition_cost NUMERIC(12,2),
  current_valuation NUMERIC(12,2),
  last_valuation_date DATE,
  annual_depreciation NUMERIC(10,2),
  property_status VARCHAR DEFAULT 'owned' CHECK (property_status IN ('owned', 'rented', 'leased')),
  usage_type VARCHAR DEFAULT 'educational' CHECK (usage_type IN ('educational', 'administrative', 'residential', 'commercial')),
  responsible_person_id UUID REFERENCES public.profiles(id),
  insurance_policy VARCHAR,
  insurance_expiry DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
-- Asset Categories
CREATE POLICY "Anyone can view asset categories" ON public.asset_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage asset categories" ON public.asset_categories FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Assets
CREATE POLICY "Anyone can view active assets" ON public.assets FOR SELECT USING (status = 'active' OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));
CREATE POLICY "Staff can manage assets" ON public.assets FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Asset Maintenance
CREATE POLICY "Staff can view maintenance" ON public.asset_maintenance FOR SELECT USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'teacher'::user_role]));
CREATE POLICY "Staff can manage maintenance" ON public.asset_maintenance FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Asset Bookings
CREATE POLICY "Users can view their bookings" ON public.asset_bookings FOR SELECT USING (user_id = auth.uid() OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));
CREATE POLICY "Users can create bookings" ON public.asset_bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their pending bookings" ON public.asset_bookings FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Staff can manage all bookings" ON public.asset_bookings FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Procurement Requests
CREATE POLICY "Users can view relevant procurement" ON public.procurement_requests FOR SELECT USING (requested_by = auth.uid() OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'finance'::user_role]));
CREATE POLICY "Users can create procurement requests" ON public.procurement_requests FOR INSERT WITH CHECK (requested_by = auth.uid());
CREATE POLICY "Users can update their draft requests" ON public.procurement_requests FOR UPDATE USING (requested_by = auth.uid() AND status = 'draft');
CREATE POLICY "Staff can manage procurement" ON public.procurement_requests FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'finance'::user_role]));

-- Procurement Items
CREATE POLICY "Users can view relevant procurement items" ON public.procurement_items FOR SELECT USING (request_id IN (SELECT id FROM public.procurement_requests WHERE requested_by = auth.uid() OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'finance'::user_role])));
CREATE POLICY "Users can manage items in their requests" ON public.procurement_items FOR ALL USING (request_id IN (SELECT id FROM public.procurement_requests WHERE requested_by = auth.uid()) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'finance'::user_role]));

-- Properties
CREATE POLICY "Staff can view properties" ON public.properties FOR SELECT USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role, 'finance'::user_role]));
CREATE POLICY "Admins can manage properties" ON public.properties FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'finance'::user_role]));

-- Triggers pour updated_at
CREATE TRIGGER update_asset_categories_updated_at BEFORE UPDATE ON public.asset_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_asset_maintenance_updated_at BEFORE UPDATE ON public.asset_maintenance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_asset_bookings_updated_at BEFORE UPDATE ON public.asset_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_procurement_requests_updated_at BEFORE UPDATE ON public.procurement_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION public.generate_asset_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    year_suffix TEXT;
    next_sequence INTEGER;
    new_number TEXT;
BEGIN
    year_suffix := RIGHT(EXTRACT(YEAR FROM now())::TEXT, 2);
    
    SELECT COALESCE(MAX(
        CAST(RIGHT(asset_number, 4) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM public.assets
    WHERE asset_number LIKE ('AST' || year_suffix || '%');
    
    new_number := 'AST' || year_suffix || LPAD(next_sequence::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_procurement_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    year_suffix TEXT;
    next_sequence INTEGER;
    new_number TEXT;
BEGIN
    year_suffix := RIGHT(EXTRACT(YEAR FROM now())::TEXT, 2);
    
    SELECT COALESCE(MAX(
        CAST(RIGHT(request_number, 4) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM public.procurement_requests
    WHERE request_number LIKE ('PR' || year_suffix || '%');
    
    new_number := 'PR' || year_suffix || LPAD(next_sequence::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;