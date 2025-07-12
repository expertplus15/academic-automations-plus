-- Script de données test simplifié pour diagnostic Finance
-- Étape 2 : Injection données test (version corrigée)

-- 1. Ajouter des fournisseurs
INSERT INTO suppliers (name, siret, address, contact_email, contact_phone, is_active) VALUES
('BUREAU EXPERT SAS', '12345678901234', '15 Rue de la République, 75001 Paris', 'contact@bureau-expert.fr', '0145678901', true),
('FOURNITURES PRO', '23456789012345', '42 Avenue des Champs, 69001 Lyon', 'vente@fournitures-pro.com', '0478123456', true),
('TECH SOLUTIONS', '34567890123456', '8 Place Bellecour, 69002 Lyon', 'info@tech-solutions.fr', '0472345678', true),
('IMPRIMERIE MODERNE', '45678901234567', '25 Boulevard Voltaire, 75011 Paris', 'commande@imprimerie-moderne.fr', '0143567890', true),
('ÉLECTRO SERVICES', '56789012345678', '12 Rue Victor Hugo, 33000 Bordeaux', 'service@electro-services.fr', '0556789012', true);

-- 2. Ajouter des comptes du plan comptable (types français corrects)
INSERT INTO chart_of_accounts (account_number, account_name, account_type, is_active) VALUES
('401001', 'Fournisseurs - Bureau Expert', 'passif', true),
('401002', 'Fournisseurs - Fournitures Pro', 'passif', true),
('401003', 'Fournisseurs - Tech Solutions', 'passif', true),
('606100', 'Achats de fournitures de bureau', 'charges', true),
('606200', 'Achats matériel informatique', 'charges', true),
('512100', 'Banque - Compte principal', 'actif', true),
('512200', 'Banque - Compte épargne', 'actif', true),
('411000', 'Clients - Étudiants', 'actif', true),
('707000', 'Ventes de prestations de services', 'produits', true),
('445660', 'TVA déductible', 'actif', true),
('445710', 'TVA collectée', 'passif', true),
('641000', 'Rémunérations du personnel', 'charges', true);

-- 3. Créer des écritures comptables avec montants réalistes pour tester la réconciliation
INSERT INTO accounting_entries (reference_number, entry_date, description, total_amount, status, fiscal_year_id) VALUES
('ECR240101', '2024-01-15', 'ACHAT FOURNITURES BUREAU EXPERT', 1020.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240102', '2024-01-16', 'VIREMENT SCOLARITE DUPONT MARIE', 2500.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240103', '2024-01-17', 'VIR SEPA FOURNITURES BUREAU', 850.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240104', '2024-01-18', 'VIREMENT SALAIRES PERSONNEL', 45000.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240105', '2024-01-19', 'PAIEMENT SCOLARITE MARTIN PAUL', 2800.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240106', '2024-01-20', 'ACHAT PRESTATIONS MAINTENANCE', 1500.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240107', '2024-01-21', 'PAIEMENT FRAIS INSCRIPTION', 450.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240108', '2024-01-22', 'ACHAT FOURNITURES PEDAGOGIQUES', 680.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1));

-- 4. Créer des lignes d'écritures comptables basiques (une ligne de débit, une de crédit)
WITH entry_details AS (
  SELECT 
    ae.id as entry_id,
    ae.description,
    ae.total_amount,
    CASE 
      WHEN ae.description LIKE '%FOURNITURES BUREAU%' THEN '606100'
      WHEN ae.description LIKE '%SCOLARITE%' THEN '512100' 
      WHEN ae.description LIKE '%VIR SEPA%' THEN '606200'
      WHEN ae.description LIKE '%SALAIRES%' THEN '641000'
      WHEN ae.description LIKE '%MAINTENANCE%' THEN '606200'
      WHEN ae.description LIKE '%INSCRIPTION%' THEN '512100'
      WHEN ae.description LIKE '%PEDAGOGIQUES%' THEN '606100'
    END as debit_account,
    CASE 
      WHEN ae.description LIKE '%FOURNITURES BUREAU%' THEN '401001'
      WHEN ae.description LIKE '%SCOLARITE%' THEN '707000'
      WHEN ae.description LIKE '%VIR SEPA%' THEN '512100'
      WHEN ae.description LIKE '%SALAIRES%' THEN '512100'
      WHEN ae.description LIKE '%MAINTENANCE%' THEN '512100'
      WHEN ae.description LIKE '%INSCRIPTION%' THEN '707000'
      WHEN ae.description LIKE '%PEDAGOGIQUES%' THEN '512100'
    END as credit_account
  FROM accounting_entries ae
  WHERE ae.reference_number LIKE 'ECR24%'
)
INSERT INTO accounting_entry_lines (entry_id, account_id, description, debit_amount, credit_amount)
SELECT ed.entry_id, ca.id, 'Ligne débit', ed.total_amount, 0
FROM entry_details ed
JOIN chart_of_accounts ca ON ca.account_number = ed.debit_account
UNION ALL
SELECT ed.entry_id, ca.id, 'Ligne crédit', 0, ed.total_amount  
FROM entry_details ed
JOIN chart_of_accounts ca ON ca.account_number = ed.credit_account;

-- 5. Créer des dépenses (structure simplifiée)
INSERT INTO expenses (expense_number, supplier_id, amount, expense_date, description, approval_status)
SELECT 
  'EXP24' || LPAD((ROW_NUMBER() OVER())::text, 4, '0'),
  s.id,
  CASE s.name
    WHEN 'BUREAU EXPERT SAS' THEN 1020.00
    WHEN 'FOURNITURES PRO' THEN 680.00
    WHEN 'TECH SOLUTIONS' THEN 1500.00
    WHEN 'IMPRIMERIE MODERNE' THEN 450.00
    WHEN 'ÉLECTRO SERVICES' THEN 850.00
  END,
  '2024-01-' || LPAD((15 + ROW_NUMBER() OVER())::text, 2, '0'),
  CASE s.name
    WHEN 'BUREAU EXPERT SAS' THEN 'Fournitures de bureau - Papeterie'
    WHEN 'FOURNITURES PRO' THEN 'Fournitures pédagogiques diverses'
    WHEN 'TECH SOLUTIONS' THEN 'Maintenance systèmes informatiques'
    WHEN 'IMPRIMERIE MODERNE' THEN 'Impression supports pédagogiques'
    WHEN 'ÉLECTRO SERVICES' THEN 'Réparation équipements électroniques'
  END,
  'approved'
FROM suppliers s;