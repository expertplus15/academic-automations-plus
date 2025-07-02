-- Create service_types table
CREATE TABLE public.service_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  default_price DECIMAL(10,2),
  is_taxable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fee_types table
CREATE TABLE public.fee_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  fee_category VARCHAR NOT NULL DEFAULT 'mandatory', -- mandatory, optional, penalty, late_fee
  default_amount DECIMAL(10,2),
  is_percentage BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_services table for detailed invoice lines
CREATE TABLE public.invoice_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  service_type_id UUID REFERENCES public.service_types(id),
  fee_type_id UUID REFERENCES public.fee_types(id),
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Modify invoices table to allow free invoices (student_id nullable)
ALTER TABLE public.invoices ALTER COLUMN student_id DROP NOT NULL;

-- Add recipient information for free invoices
ALTER TABLE public.invoices ADD COLUMN recipient_name VARCHAR;
ALTER TABLE public.invoices ADD COLUMN recipient_email VARCHAR;
ALTER TABLE public.invoices ADD COLUMN recipient_address TEXT;
ALTER TABLE public.invoices ADD COLUMN invoice_type VARCHAR DEFAULT 'student'; -- 'student' or 'free'

-- Enable RLS on new tables
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service_types
CREATE POLICY "Users can view service types"
ON public.service_types
FOR SELECT
USING (true);

CREATE POLICY "Finance staff can manage service types"
ON public.service_types
FOR ALL
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Create RLS policies for fee_types
CREATE POLICY "Users can view fee types"
ON public.fee_types
FOR SELECT
USING (true);

CREATE POLICY "Finance staff can manage fee types"
ON public.fee_types
FOR ALL
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Create RLS policies for invoice_services
CREATE POLICY "Finance staff can manage invoice services"
ON public.invoice_services
FOR ALL
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

CREATE POLICY "Users can view their invoice services"
ON public.invoice_services
FOR SELECT
USING (
  invoice_id IN (
    SELECT id FROM public.invoices 
    WHERE (student_id IN (
      SELECT id FROM public.students WHERE profile_id = auth.uid()
    )) OR get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role])
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_service_types_updated_at
BEFORE UPDATE ON public.service_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_types_updated_at
BEFORE UPDATE ON public.fee_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default service types
INSERT INTO public.service_types (name, code, description, default_price, is_taxable) VALUES
('Frais de scolarité', 'TUITION', 'Frais de scolarité annuels', 2500.00, false),
('Frais d''inscription', 'ENROLLMENT', 'Frais d''inscription administrative', 150.00, false),
('Frais d''examen', 'EXAM_FEES', 'Frais de passage d''examens', 50.00, false),
('Certificat de scolarité', 'CERTIFICATE', 'Certificat de scolarité officiel', 15.00, true),
('Relevé de notes', 'TRANSCRIPT', 'Relevé de notes officiel', 25.00, true),
('Cours particuliers', 'TUTORING', 'Cours de soutien particuliers', 40.00, true),
('Matériel pédagogique', 'MATERIALS', 'Livres et matériel de cours', 120.00, true);

-- Insert some default fee types
INSERT INTO public.fee_types (name, code, description, fee_category, default_amount, is_percentage) VALUES
('Frais obligatoires', 'MANDATORY', 'Frais obligatoires pour tous les étudiants', 'mandatory', 0.00, false),
('Frais optionnels', 'OPTIONAL', 'Frais optionnels selon les services choisis', 'optional', 0.00, false),
('Pénalité de retard', 'LATE_PENALTY', 'Pénalité pour paiement en retard', 'penalty', 50.00, false),
('Frais de retard', 'LATE_FEE', 'Pourcentage de frais de retard', 'late_fee', 5.00, true),
('Frais de dossier', 'PROCESSING', 'Frais de traitement administratif', 'mandatory', 30.00, false);