-- Phase 1: Architecture et Fondations - Module Finance
-- Création des tables principales pour le module finance

-- Table des années fiscales
CREATE TABLE public.fiscal_years (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'active',
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des catégories financières
CREATE TABLE public.financial_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  category_type VARCHAR NOT NULL DEFAULT 'income', -- income, expense, fee
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des méthodes de paiement
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  is_online BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  processing_fee_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des comptes étudiants
CREATE TABLE public.students_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  fiscal_year_id UUID NOT NULL REFERENCES public.fiscal_years(id),
  current_balance DECIMAL(10,2) DEFAULT 0,
  total_charged DECIMAL(10,2) DEFAULT 0,
  total_paid DECIMAL(10,2) DEFAULT 0,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR NOT NULL DEFAULT 'active', -- active, suspended, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, fiscal_year_id)
);

-- Table des factures
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES public.students(id),
  fiscal_year_id UUID NOT NULL REFERENCES public.fiscal_years(id),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  status VARCHAR NOT NULL DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des lignes de facture
CREATE TABLE public.invoice_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  financial_category_id UUID NOT NULL REFERENCES public.financial_categories(id),
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des paiements
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_number VARCHAR NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES public.students(id),
  invoice_id UUID REFERENCES public.invoices(id),
  payment_method_id UUID NOT NULL REFERENCES public.payment_methods(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  transaction_reference VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  notes TEXT,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des transactions (journal général)
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_number VARCHAR NOT NULL UNIQUE,
  student_id UUID REFERENCES public.students(id),
  financial_category_id UUID NOT NULL REFERENCES public.financial_categories(id),
  transaction_type VARCHAR NOT NULL, -- debit, credit
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference_type VARCHAR, -- invoice, payment, adjustment
  reference_id UUID,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  fiscal_year_id UUID NOT NULL REFERENCES public.fiscal_years(id),
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des bourses
CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  scholarship_type VARCHAR NOT NULL, -- merit, need_based, athletic, etc.
  amount DECIMAL(10,2) NOT NULL,
  percentage DECIMAL(5,2), -- pourcentage de réduction si applicable
  max_recipients INTEGER,
  eligibility_criteria JSONB DEFAULT '{}',
  academic_year_id UUID REFERENCES public.academic_years(id),
  is_active BOOLEAN DEFAULT true,
  application_deadline DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des aides financières
CREATE TABLE public.financial_aid (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  scholarship_id UUID REFERENCES public.scholarships(id),
  aid_type VARCHAR NOT NULL, -- scholarship, grant, loan, work_study
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending', -- pending, approved, rejected, disbursed
  application_date DATE DEFAULT CURRENT_DATE,
  approval_date DATE,
  disbursement_date DATE,
  notes TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des postes budgétaires
CREATE TABLE public.budget_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  financial_category_id UUID NOT NULL REFERENCES public.financial_categories(id),
  fiscal_year_id UUID NOT NULL REFERENCES public.fiscal_years(id),
  department_id UUID REFERENCES public.departments(id),
  budgeted_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  actual_amount DECIMAL(10,2) DEFAULT 0,
  variance DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(code, fiscal_year_id)
);

-- Création des index pour améliorer les performances
CREATE INDEX idx_students_accounts_student_id ON public.students_accounts(student_id);
CREATE INDEX idx_students_accounts_fiscal_year ON public.students_accounts(fiscal_year_id);
CREATE INDEX idx_invoices_student_id ON public.invoices(student_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_payments_student_id ON public.payments(student_id);
CREATE INDEX idx_payments_payment_date ON public.payments(payment_date);
CREATE INDEX idx_transactions_student_id ON public.transactions(student_id);
CREATE INDEX idx_transactions_fiscal_year ON public.transactions(fiscal_year_id);
CREATE INDEX idx_financial_aid_student_id ON public.financial_aid(student_id);

-- Activation du Row Level Security
ALTER TABLE public.fiscal_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_aid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les données financières
-- Fiscal years - visible par tous les utilisateurs authentifiés
CREATE POLICY "Users can view fiscal years" ON public.fiscal_years FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage fiscal years" ON public.fiscal_years FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Financial categories - visible par tous, gérées par admin/finance
CREATE POLICY "Users can view financial categories" ON public.financial_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage financial categories" ON public.financial_categories FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Payment methods - visible par tous, gérées par admin/finance
CREATE POLICY "Users can view payment methods" ON public.payment_methods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage payment methods" ON public.payment_methods FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Students accounts - les étudiants voient leur compte, staff voit tout
CREATE POLICY "Students can view own account" ON public.students_accounts FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role])
);
CREATE POLICY "Finance staff can manage accounts" ON public.students_accounts FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Invoices - les étudiants voient leurs factures, staff voit tout
CREATE POLICY "Students can view own invoices" ON public.invoices FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role])
);
CREATE POLICY "Finance staff can manage invoices" ON public.invoices FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Invoice lines - accès via les factures
CREATE POLICY "Users can view invoice lines" ON public.invoice_lines FOR SELECT TO authenticated USING (
  invoice_id IN (
    SELECT id FROM public.invoices WHERE 
    student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR
    get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role])
  )
);
CREATE POLICY "Finance staff can manage invoice lines" ON public.invoice_lines FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Payments - les étudiants voient leurs paiements, staff voit tout
CREATE POLICY "Students can view own payments" ON public.payments FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role])
);
CREATE POLICY "Finance staff can manage payments" ON public.payments FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Transactions - accès restreint au staff financier
CREATE POLICY "Finance staff can view transactions" ON public.transactions FOR SELECT TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));
CREATE POLICY "Finance staff can manage transactions" ON public.transactions FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Scholarships - visible par tous, gérées par staff
CREATE POLICY "Users can view scholarships" ON public.scholarships FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can manage scholarships" ON public.scholarships FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Financial aid - les étudiants voient leurs aides, staff voit tout
CREATE POLICY "Students can view own financial aid" ON public.financial_aid FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR
  get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role])
);
CREATE POLICY "Finance staff can manage financial aid" ON public.financial_aid FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Budget items - accès restreint au staff
CREATE POLICY "Staff can view budget items" ON public.budget_items FOR SELECT TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));
CREATE POLICY "Finance staff can manage budget items" ON public.budget_items FOR ALL TO authenticated USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'finance'::user_role]));

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_fiscal_years_updated_at BEFORE UPDATE ON public.fiscal_years FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_financial_categories_updated_at BEFORE UPDATE ON public.financial_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_accounts_updated_at BEFORE UPDATE ON public.students_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON public.scholarships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_financial_aid_updated_at BEFORE UPDATE ON public.financial_aid FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON public.budget_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertion de données de base
INSERT INTO public.fiscal_years (name, start_date, end_date, is_current) VALUES 
('2024-2025', '2024-09-01', '2025-08-31', true);

INSERT INTO public.financial_categories (name, code, category_type, description) VALUES 
('Frais de scolarité', 'TUITION', 'income', 'Frais de scolarité annuels'),
('Frais d''inscription', 'REGISTRATION', 'income', 'Frais d''inscription et d''administration'),
('Frais de bibliothèque', 'LIBRARY', 'income', 'Frais d''accès à la bibliothèque'),
('Frais de laboratoire', 'LAB', 'income', 'Frais d''utilisation des laboratoires'),
('Bourses d''excellence', 'SCHOLARSHIP', 'expense', 'Bourses accordées aux étudiants'),
('Remboursements', 'REFUND', 'expense', 'Remboursements aux étudiants');

INSERT INTO public.payment_methods (name, code, is_online, processing_fee_percentage) VALUES 
('Virement bancaire', 'BANK_TRANSFER', false, 0),
('Carte bancaire', 'CREDIT_CARD', true, 2.5),
('PayPal', 'PAYPAL', true, 3.0),
('Espèces', 'CASH', false, 0),
('Chèque', 'CHECK', false, 0);