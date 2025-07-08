
-- Création des tables pour le module maintenance et mouvements d'actifs

-- Table pour les maintenances d'équipements
CREATE TABLE IF NOT EXISTS public.asset_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(50) NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'inspection')),
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  description TEXT NOT NULL,
  cost DECIMAL(10,2),
  performed_by VARCHAR(255),
  next_maintenance_date DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour l'historique des mouvements d'actifs
CREATE TABLE IF NOT EXISTS public.asset_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN ('transfer', 'acquisition', 'disposal', 'maintenance', 'loan')),
  from_location VARCHAR(255),
  to_location VARCHAR(255),
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  movement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason TEXT,
  document_url TEXT,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les réservations d'équipements/salles
CREATE TABLE IF NOT EXISTS public.asset_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id),
  room_id UUID REFERENCES public.rooms(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  purpose TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT booking_dates_valid CHECK (end_date > start_date),
  CONSTRAINT asset_or_room_required CHECK ((asset_id IS NOT NULL) OR (room_id IS NOT NULL))
);

-- Table pour les demandes d'achat/approvisionnement
CREATE TABLE IF NOT EXISTS public.procurement_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number VARCHAR(20) NOT NULL UNIQUE DEFAULT generate_procurement_number(),
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  category_id UUID REFERENCES public.asset_categories(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(10,2) NOT NULL,
  justification TEXT,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'ordered', 'received', 'cancelled')),
  budget_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  expected_delivery_date DATE,
  supplier_preference VARCHAR(255),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_asset_maintenance_asset_id ON public.asset_maintenance(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_maintenance_status ON public.asset_maintenance(status);
CREATE INDEX IF NOT EXISTS idx_asset_maintenance_scheduled_date ON public.asset_maintenance(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_asset_movements_asset_id ON public.asset_movements(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_movements_date ON public.asset_movements(movement_date);
CREATE INDEX IF NOT EXISTS idx_asset_movements_type ON public.asset_movements(movement_type);

CREATE INDEX IF NOT EXISTS idx_asset_bookings_asset_id ON public.asset_bookings(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_bookings_room_id ON public.asset_bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_asset_bookings_user_id ON public.asset_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_asset_bookings_dates ON public.asset_bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_asset_bookings_status ON public.asset_bookings(status);

CREATE INDEX IF NOT EXISTS idx_procurement_requests_status ON public.procurement_requests(status);
CREATE INDEX IF NOT EXISTS idx_procurement_requests_requested_by ON public.procurement_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_procurement_requests_created_at ON public.procurement_requests(created_at);

-- Triggers pour mise à jour automatique des timestamps
CREATE OR REPLACE TRIGGER update_asset_maintenance_updated_at
  BEFORE UPDATE ON public.asset_maintenance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_asset_bookings_updated_at
  BEFORE UPDATE ON public.asset_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_procurement_requests_updated_at
  BEFORE UPDATE ON public.procurement_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies pour la sécurité
ALTER TABLE public.asset_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_requests ENABLE ROW LEVEL SECURITY;

-- Politiques pour asset_maintenance
CREATE POLICY "Staff can manage asset maintenance" ON public.asset_maintenance
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Users can view asset maintenance" ON public.asset_maintenance
  FOR SELECT USING (true);

-- Politiques pour asset_movements
CREATE POLICY "Staff can manage asset movements" ON public.asset_movements
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Users can view asset movements" ON public.asset_movements
  FOR SELECT USING (true);

-- Politiques pour asset_bookings
CREATE POLICY "Users can manage their own bookings" ON public.asset_bookings
  FOR ALL USING (user_id = auth.uid() OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

CREATE POLICY "Staff can view all bookings" ON public.asset_bookings
  FOR SELECT USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'hr'::user_role]));

-- Politiques pour procurement_requests
CREATE POLICY "Users can manage their own procurement requests" ON public.procurement_requests
  FOR ALL USING (requested_by = auth.uid() OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'finance'::user_role]));

CREATE POLICY "Staff can view all procurement requests" ON public.procurement_requests
  FOR SELECT USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'finance'::user_role, 'hr'::user_role]));
