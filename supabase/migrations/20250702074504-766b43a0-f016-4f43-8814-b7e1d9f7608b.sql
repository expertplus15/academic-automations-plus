-- Phase 2: Structure de données pour états financiers et dépenses

-- Table pour les comptes comptables (plan comptable)
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_number varchar NOT NULL UNIQUE,
  account_name varchar NOT NULL,
  account_type varchar NOT NULL CHECK (account_type IN ('actif', 'passif', 'charges', 'produits')),
  parent_account_id uuid REFERENCES public.chart_of_accounts(id),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table pour les fournisseurs
CREATE TABLE IF NOT EXISTS public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  siret varchar,
  address text,
  contact_email varchar,
  contact_phone varchar,
  payment_terms integer DEFAULT 30,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table pour les dépenses
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_number varchar NOT NULL UNIQUE,
  supplier_id uuid REFERENCES public.suppliers(id),
  financial_category_id uuid REFERENCES public.financial_categories(id),
  amount numeric NOT NULL CHECK (amount > 0),
  expense_date date NOT NULL,
  due_date date,
  description text NOT NULL,
  receipt_url text,
  approval_status varchar DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'paid')),
  approved_by uuid REFERENCES public.profiles(id),
  approved_at timestamp with time zone,
  fiscal_year_id uuid REFERENCES public.fiscal_years(id),
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table pour les écritures comptables
CREATE TABLE IF NOT EXISTS public.accounting_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date date NOT NULL,
  fiscal_year_id uuid REFERENCES public.fiscal_years(id),
  reference_number varchar NOT NULL UNIQUE,
  description text,
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  status varchar DEFAULT 'draft' CHECK (status IN ('draft', 'validated', 'posted')),
  created_by uuid REFERENCES public.profiles(id),
  validated_by uuid REFERENCES public.profiles(id),
  validated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Détail des écritures (débit/crédit)
CREATE TABLE IF NOT EXISTS public.accounting_entry_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES public.accounting_entries(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.chart_of_accounts(id),
  debit_amount numeric DEFAULT 0 CHECK (debit_amount >= 0),
  credit_amount numeric DEFAULT 0 CHECK (credit_amount >= 0),
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Extension de financial_categories pour liaison avec comptes comptables
ALTER TABLE public.financial_categories 
ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.chart_of_accounts(id);

-- RLS Policies pour suppliers
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finance staff can manage suppliers" 
ON public.suppliers 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

CREATE POLICY "Users can view suppliers" 
ON public.suppliers 
FOR SELECT 
USING (true);

-- RLS Policies pour expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finance staff can manage expenses" 
ON public.expenses 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

CREATE POLICY "Users can view expenses" 
ON public.expenses 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- RLS Policies pour chart_of_accounts
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finance staff can manage chart of accounts" 
ON public.chart_of_accounts 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

CREATE POLICY "Users can view chart of accounts" 
ON public.chart_of_accounts 
FOR SELECT 
USING (true);

-- RLS Policies pour accounting_entries
ALTER TABLE public.accounting_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finance staff can manage accounting entries" 
ON public.accounting_entries 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- RLS Policies pour accounting_entry_lines
ALTER TABLE public.accounting_entry_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finance staff can manage accounting entry lines" 
ON public.accounting_entry_lines 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chart_of_accounts_updated_at
    BEFORE UPDATE ON public.chart_of_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounting_entries_updated_at
    BEFORE UPDATE ON public.accounting_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour générer les numéros de dépenses
CREATE OR REPLACE FUNCTION public.generate_expense_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    next_sequence INTEGER;
    new_number TEXT;
BEGIN
    year_suffix := RIGHT(EXTRACT(YEAR FROM now())::TEXT, 2);
    
    SELECT COALESCE(MAX(
        CAST(RIGHT(expense_number, 4) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM public.expenses
    WHERE expense_number LIKE ('EXP' || year_suffix || '%');
    
    new_number := 'EXP' || year_suffix || LPAD(next_sequence::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertion de données de base pour le plan comptable
INSERT INTO public.chart_of_accounts (account_number, account_name, account_type) VALUES
('1000', 'Immobilisations incorporelles', 'actif'),
('2000', 'Immobilisations corporelles', 'actif'),
('3000', 'Stocks', 'actif'),
('4000', 'Créances', 'actif'),
('5000', 'Trésorerie', 'actif'),
('1500', 'Capital', 'passif'),
('1600', 'Réserves', 'passif'),
('4500', 'Dettes fournisseurs', 'passif'),
('4600', 'Dettes fiscales', 'passif'),
('6000', 'Achats', 'charges'),
('6100', 'Services extérieurs', 'charges'),
('6200', 'Charges de personnel', 'charges'),
('7000', 'Frais de scolarité', 'produits'),
('7100', 'Formations', 'produits'),
('7500', 'Subventions', 'produits')
ON CONFLICT (account_number) DO NOTHING;