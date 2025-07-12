-- Script de données test pour diagnostic Finance
-- Étape 2 : Injection données test (1h)

-- 1. Ajouter des fournisseurs
INSERT INTO suppliers (name, siret, address, contact_email, contact_phone, is_active) VALUES
('BUREAU EXPERT SAS', '12345678901234', '15 Rue de la République, 75001 Paris', 'contact@bureau-expert.fr', '0145678901', true),
('FOURNITURES PRO', '23456789012345', '42 Avenue des Champs, 69001 Lyon', 'vente@fournitures-pro.com', '0478123456', true),
('TECH SOLUTIONS', '34567890123456', '8 Place Bellecour, 69002 Lyon', 'info@tech-solutions.fr', '0472345678', true),
('IMPRIMERIE MODERNE', '45678901234567', '25 Boulevard Voltaire, 75011 Paris', 'commande@imprimerie-moderne.fr', '0143567890', true),
('ÉLECTRO SERVICES', '56789012345678', '12 Rue Victor Hugo, 33000 Bordeaux', 'service@electro-services.fr', '0556789012', true);

-- 2. Ajouter des comptes du plan comptable
INSERT INTO chart_of_accounts (account_number, account_name, account_type, is_active) VALUES
('401001', 'Fournisseurs - Bureau Expert', 'liability', true),
('401002', 'Fournisseurs - Fournitures Pro', 'liability', true),
('401003', 'Fournisseurs - Tech Solutions', 'liability', true),
('606100', 'Achats de fournitures de bureau', 'expense', true),
('606200', 'Achats matériel informatique', 'expense', true),
('512100', 'Banque - Compte principal', 'asset', true),
('512200', 'Banque - Compte épargne', 'asset', true),
('411000', 'Clients - Étudiants', 'asset', true),
('707000', 'Ventes de prestations de services', 'revenue', true),
('445660', 'TVA déductible', 'asset', true),
('445710', 'TVA collectée', 'liability', true);

-- 3. Créer des écritures comptables avec montants cohérents
INSERT INTO accounting_entries (reference_number, entry_date, description, total_amount, status, fiscal_year_id) VALUES
('ECR240101', '2024-01-15', 'Achat fournitures bureau - Bureau Expert', 1020.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240102', '2024-01-16', 'Paiement scolarité étudiant Dupont', 2500.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240103', '2024-01-17', 'Achat matériel informatique', 850.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240104', '2024-01-18', 'Virement salaires personnel', 45000.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240105', '2024-01-19', 'Paiement scolarité étudiant Martin', 2800.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240106', '2024-01-20', 'Achat prestations maintenance', 1500.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240107', '2024-01-21', 'Paiement frais inscription Durand', 450.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1)),
('ECR240108', '2024-01-22', 'Achat fournitures pédagogiques', 680.00, 'validated', (SELECT id FROM fiscal_years WHERE is_current = true LIMIT 1));

-- 4. Créer les lignes d'écritures comptables correspondantes
INSERT INTO accounting_entry_lines (entry_id, account_id, description, debit_amount, credit_amount)
SELECT 
  ae.id,
  ca.id,
  CASE 
    WHEN ae.description LIKE '%Achat fournitures bureau%' THEN 
      CASE WHEN ca.account_number = '606100' THEN 'Fournitures bureau'
           WHEN ca.account_number = '445660' THEN 'TVA 20%'
           WHEN ca.account_number = '401001' THEN 'Fournisseur'
      END
    WHEN ae.description LIKE '%scolarité%' THEN
      CASE WHEN ca.account_number = '512100' THEN 'Encaissement banque'
           WHEN ca.account_number = '707000' THEN 'Prestation formation'
           WHEN ca.account_number = '445710' THEN 'TVA collectée'
      END
    WHEN ae.description LIKE '%matériel informatique%' THEN
      CASE WHEN ca.account_number = '606200' THEN 'Matériel informatique'
           WHEN ca.account_number = '512100' THEN 'Paiement banque'
      END
    WHEN ae.description LIKE '%salaires%' THEN
      CASE WHEN ca.account_number = '641000' THEN 'Salaires bruts'
           WHEN ca.account_number = '512100' THEN 'Virement banque'
      END
  END,
  CASE 
    -- Achat fournitures bureau (1020€ TTC)
    WHEN ae.description LIKE '%Achat fournitures bureau%' AND ca.account_number = '606100' THEN 850.00
    WHEN ae.description LIKE '%Achat fournitures bureau%' AND ca.account_number = '445660' THEN 170.00
    WHEN ae.description LIKE '%Achat fournitures bureau%' AND ca.account_number = '401001' THEN 0
    
    -- Paiement scolarité Dupont (2500€)
    WHEN ae.description LIKE '%Dupont%' AND ca.account_number = '512100' THEN 2500.00
    WHEN ae.description LIKE '%Dupont%' AND ca.account_number = '707000' THEN 0
    
    -- Matériel informatique (850€)
    WHEN ae.description LIKE '%matériel informatique%' AND ca.account_number = '606200' THEN 850.00
    WHEN ae.description LIKE '%matériel informatique%' AND ca.account_number = '512100' THEN 0
    
    -- Salaires (45000€)
    WHEN ae.description LIKE '%salaires%' AND ca.account_number = '641000' THEN 45000.00
    
    -- Paiement Martin (2800€)
    WHEN ae.description LIKE '%Martin%' AND ca.account_number = '512100' THEN 2800.00
    
    ELSE 0
  END,
  CASE 
    -- Achat fournitures bureau - Crédit fournisseur
    WHEN ae.description LIKE '%Achat fournitures bureau%' AND ca.account_number = '401001' THEN 1020.00
    WHEN ae.description LIKE '%Achat fournitures bureau%' AND ca.account_number = '606100' THEN 0
    WHEN ae.description LIKE '%Achat fournitures bureau%' AND ca.account_number = '445660' THEN 0
    
    -- Paiement scolarité - Crédit prestations
    WHEN ae.description LIKE '%Dupont%' AND ca.account_number = '707000' THEN 2500.00
    WHEN ae.description LIKE '%Dupont%' AND ca.account_number = '512100' THEN 0
    
    -- Matériel informatique - Crédit banque
    WHEN ae.description LIKE '%matériel informatique%' AND ca.account_number = '512100' THEN 850.00
    WHEN ae.description LIKE '%matériel informatique%' AND ca.account_number = '606200' THEN 0
    
    -- Salaires - Crédit banque
    WHEN ae.description LIKE '%salaires%' AND ca.account_number = '512100' THEN 45000.00
    WHEN ae.description LIKE '%salaires%' AND ca.account_number = '641000' THEN 0
    
    -- Paiement Martin - Crédit prestations
    WHEN ae.description LIKE '%Martin%' AND ca.account_number = '707000' THEN 2800.00
    
    ELSE 0
  END
FROM accounting_entries ae
CROSS JOIN chart_of_accounts ca
WHERE 
  (ae.description LIKE '%Achat fournitures bureau%' AND ca.account_number IN ('606100', '445660', '401001'))
  OR (ae.description LIKE '%Dupont%' AND ca.account_number IN ('512100', '707000'))
  OR (ae.description LIKE '%matériel informatique%' AND ca.account_number IN ('606200', '512100'))
  OR (ae.description LIKE '%salaires%' AND ca.account_number IN ('641000', '512100'))
  OR (ae.description LIKE '%Martin%' AND ca.account_number IN ('512100', '707000'));

-- 5. Créer des dépenses avec références fournisseurs
INSERT INTO expenses (expense_number, supplier_id, amount, expense_date, description, status, approval_status)
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
  'validated',
  'approved'
FROM suppliers s;