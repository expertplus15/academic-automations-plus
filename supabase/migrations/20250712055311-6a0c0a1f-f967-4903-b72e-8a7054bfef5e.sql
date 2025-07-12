-- CORRECTION 1 : Corriger l'écriture débalancée (salaires)
-- L'écriture ECR240104 n'a pas de ligne de crédit correspondante

-- Ajouter la ligne de crédit manquante pour les salaires
INSERT INTO accounting_entry_lines (entry_id, account_id, description, debit_amount, credit_amount)
SELECT 
  ae.id,
  ca.id,
  'Virement salaires - crédit banque',
  0,
  45000.00
FROM accounting_entries ae
CROSS JOIN chart_of_accounts ca
WHERE ae.reference_number = 'ECR240104'
AND ca.account_number = '512100';

-- CORRECTION 2 : Corriger les données de réconciliation bancaire réelles
-- Remplacer les données mockées par des données cohérentes avec les écritures comptables

-- Mise à jour du hook useBankReconciliation avec de vraies données de test
-- Les données bankTransactions seront mises à jour dans le code pour correspondre aux écritures

-- CORRECTION 3 : Vérifier et corriger toutes les écritures pour équilibre
-- Identifier toutes les écritures déséquilibrées
WITH unbalanced_entries AS (
  SELECT 
    ae.id,
    ae.reference_number,
    SUM(COALESCE(ael.debit_amount, 0)) as total_debit,
    SUM(COALESCE(ael.credit_amount, 0)) as total_credit,
    ABS(SUM(COALESCE(ael.debit_amount, 0)) - SUM(COALESCE(ael.credit_amount, 0))) as difference
  FROM accounting_entries ae
  JOIN accounting_entry_lines ael ON ae.id = ael.entry_id
  GROUP BY ae.id, ae.reference_number
  HAVING ABS(SUM(COALESCE(ael.debit_amount, 0)) - SUM(COALESCE(ael.credit_amount, 0))) > 0.01
)
-- Afficher un résumé des corrections nécessaires
SELECT 
  COUNT(*) as ecritures_a_corriger,
  SUM(difference) as total_desequilibre
FROM unbalanced_entries;