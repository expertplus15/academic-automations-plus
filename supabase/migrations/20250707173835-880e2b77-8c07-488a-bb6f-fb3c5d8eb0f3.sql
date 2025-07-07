-- Create payment_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default payment methods if table is empty
INSERT INTO public.payment_methods (name, code, description) 
SELECT * FROM (VALUES
  ('Carte bancaire', 'CB', 'Paiement par carte bancaire'),
  ('Virement', 'VIR', 'Virement bancaire'),
  ('Chèque', 'CHQ', 'Paiement par chèque'),
  ('Espèces', 'ESP', 'Paiement en espèces'),
  ('Prélèvement', 'PREL', 'Prélèvement automatique')
) AS v(name, code, description)
WHERE NOT EXISTS (SELECT 1 FROM public.payment_methods);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Finance staff can manage payment methods" 
ON public.payment_methods 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Add trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();