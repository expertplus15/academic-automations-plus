-- Commercial clients table
CREATE TABLE public.commercial_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name VARCHAR NOT NULL,
  contact_first_name VARCHAR,
  contact_last_name VARCHAR,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  siret VARCHAR,
  vat_number VARCHAR,
  billing_address TEXT,
  shipping_address TEXT,
  industry VARCHAR,
  payment_terms INTEGER DEFAULT 30,
  credit_limit DECIMAL,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Commercial quotations table
CREATE TABLE public.commercial_quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_number VARCHAR NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.commercial_clients(id),
  title VARCHAR NOT NULL,
  description TEXT,
  quotation_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  subtotal DECIMAL NOT NULL DEFAULT 0,
  tax_rate DECIMAL DEFAULT 20.00,
  tax_amount DECIMAL DEFAULT 0,
  total_amount DECIMAL NOT NULL DEFAULT 0,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  notes TEXT,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Commercial invoices table
CREATE TABLE public.commercial_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.commercial_clients(id),
  quotation_id UUID REFERENCES public.commercial_quotations(id),
  title VARCHAR NOT NULL,
  description TEXT,
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL NOT NULL DEFAULT 0,
  tax_rate DECIMAL DEFAULT 20.00,
  tax_amount DECIMAL DEFAULT 0,
  total_amount DECIMAL NOT NULL DEFAULT 0,
  paid_amount DECIMAL DEFAULT 0,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled')),
  payment_method VARCHAR,
  payment_date DATE,
  notes TEXT,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Quotation lines table
CREATE TABLE public.quotation_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID NOT NULL REFERENCES public.commercial_quotations(id) ON DELETE CASCADE,
  service_name VARCHAR NOT NULL,
  description TEXT,
  quantity DECIMAL NOT NULL DEFAULT 1,
  unit_price DECIMAL NOT NULL,
  discount_percentage DECIMAL DEFAULT 0,
  line_total DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Commercial invoice lines table
CREATE TABLE public.commercial_invoice_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.commercial_invoices(id) ON DELETE CASCADE,
  service_name VARCHAR NOT NULL,
  description TEXT,
  quantity DECIMAL NOT NULL DEFAULT 1,
  unit_price DECIMAL NOT NULL,
  discount_percentage DECIMAL DEFAULT 0,
  line_total DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.commercial_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercial_invoice_lines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for commercial_clients
CREATE POLICY "Finance staff can manage commercial clients" ON public.commercial_clients
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- RLS Policies for commercial_quotations
CREATE POLICY "Finance staff can manage quotations" ON public.commercial_quotations
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- RLS Policies for commercial_invoices
CREATE POLICY "Finance staff can manage commercial invoices" ON public.commercial_invoices
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- RLS Policies for quotation_lines
CREATE POLICY "Finance staff can manage quotation lines" ON public.quotation_lines
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- RLS Policies for commercial_invoice_lines
CREATE POLICY "Finance staff can manage commercial invoice lines" ON public.commercial_invoice_lines
FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Auto-update timestamps trigger
CREATE TRIGGER update_commercial_clients_updated_at
BEFORE UPDATE ON public.commercial_clients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commercial_quotations_updated_at
BEFORE UPDATE ON public.commercial_quotations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commercial_invoices_updated_at
BEFORE UPDATE ON public.commercial_invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate quotation numbers
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
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
        CAST(RIGHT(quotation_number, 4) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM public.commercial_quotations
    WHERE quotation_number LIKE ('DEVIS' || year_suffix || '%');
    
    new_number := 'DEVIS' || year_suffix || LPAD(next_sequence::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

-- Function to generate commercial invoice numbers
CREATE OR REPLACE FUNCTION public.generate_commercial_invoice_number()
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
        CAST(RIGHT(invoice_number, 4) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM public.commercial_invoices
    WHERE invoice_number LIKE ('FCOM' || year_suffix || '%');
    
    new_number := 'FCOM' || year_suffix || LPAD(next_sequence::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;