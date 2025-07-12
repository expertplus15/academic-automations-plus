-- Script de données test final pour diagnostic Finance
-- Version corrigée avec casting date

-- 1. Ajouter des fournisseurs
INSERT INTO suppliers (name, siret, address, contact_email, contact_phone, is_active) VALUES
('BUREAU EXPERT SAS', '12345678901234', '15 Rue de la République, 75001 Paris', 'contact@bureau-expert.fr', '0145678901', true),
('FOURNITURES PRO', '23456789012345', '42 Avenue des Champs, 69001 Lyon', 'vente@fournitures-pro.com', '0478123456', true),
('TECH SOLUTIONS', '34567890123456', '8 Place Bellecour, 69002 Lyon', 'info@tech-solutions.fr', '0472345678', true),
('IMPRIMERIE MODERNE', '45678901234567', '25 Boulevard Voltaire, 75011 Paris', 'commande@imprimerie-moderne.fr', '0143567890', true),
('ÉLECTRO SERVICES', '56789012345678', '12 Rue Victor Hugo, 33000 Bordeaux', 'service@electro-services.fr', '0556789012', true);

-- 2. Ajouter des comptes du plan comptable
INSERT INTO chart_of_accounts (account_number, account_name, account_type, is_active) VALUES
('401001', 'Fournisseurs - Bureau Expert', 'passif', true),
('401002', 'Fournisseurs - Fournitures Pro', 'passif', true),
('401003', 'Fournisseurs - Tech Solutions', 'passif', true),
('606100', 'Achats de fournitures de bureau', 'charges', true),
('606200', 'Achats matériel informatique', 'charges', true),
('512100', 'Banque - Compte principal', 'actif', true),
('411000', 'Clients - Étudiants', 'actif', true),
('707000', 'Ventes de prestations de services', 'produits', true),
('641000', 'Rémunérations du personnel', 'charges', true);

-- 3. Créer des écritures comptables pour test de réconciliation
INSERT INTO accounting_entries (reference_number, entry_date, description, total_amount, status, fiscal_year_id) VALUES
('ECR240101', '2024-01-15', 'ACHAT FOURNITURES BUREAU EXPERT', 1020.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240102', '2024-01-16', 'VIREMENT SCOLARITE DUPONT MARIE', 2500.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240103', '2024-01-17', 'VIR SEPA FOURNITURES BUREAU', 850.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240104', '2024-01-18', 'VIREMENT SALAIRES PERSONNEL', 45000.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1));

-- 4. Créer des lignes d'écritures (simplifiées)
INSERT INTO accounting_entry_lines (entry_id, account_id, description, debit_amount, credit_amount)
SELECT 
  ae.id,
  (SELECT id FROM chart_of_accounts WHERE account_number = '606100' LIMIT 1),
  'Fournitures',
  ae.total_amount,
  0
FROM accounting_entries ae WHERE ae.description LIKE '%FOURNITURES%'
UNION ALL
SELECT 
  ae.id,
  (SELECT id FROM chart_of_accounts WHERE account_number = '512100' LIMIT 1),
  'Banque',
  ae.total_amount,
  0
FROM accounting_entries ae WHERE ae.description LIKE '%SCOLARITE%' OR ae.description LIKE '%SALAIRES%'
UNION ALL
SELECT 
  ae.id,
  (SELECT id FROM chart_of_accounts WHERE account_number = '401001' LIMIT 1),
  'Fournisseur',
  0,
  ae.total_amount
FROM accounting_entries ae WHERE ae.description LIKE '%FOURNITURES%'
UNION ALL
SELECT 
  ae.id,
  (SELECT id FROM chart_of_accounts WHERE account_number = '707000' LIMIT 1),
  'Prestations',
  0,
  ae.total_amount
FROM accounting_entries ae WHERE ae.description LIKE '%SCOLARITE%';

-- 5. Créer des dépenses
INSERT INTO expenses (expense_number, supplier_id, amount, expense_date, description, approval_status)
VALUES
('EXP240001', (SELECT id FROM suppliers WHERE name = 'BUREAU EXPERT SAS'), 1020.00, '2024-01-16'::date, 'Fournitures de bureau', 'approved'),
('EXP240002', (SELECT id FROM suppliers WHERE name = 'FOURNITURES PRO'), 680.00, '2024-01-17'::date, 'Fournitures pédagogiques', 'approved'),
('EXP240003', (SELECT id FROM suppliers WHERE name = 'TECH SOLUTIONS'), 1500.00, '2024-01-18'::date, 'Maintenance informatique', 'approved');