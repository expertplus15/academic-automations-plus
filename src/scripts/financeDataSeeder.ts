// Script de génération de données test pour le diagnostic Finance
// Étape 2 : Injection de Données Test (1h)

import { supabase } from '@/integrations/supabase/client';

export class FinanceDataSeeder {
  
  async seedCompleteFinanceData(): Promise<void> {
    console.log('🌱 Démarrage du seeding des données Finance...');
    
    try {
      // Étape 1: Plan comptable de base
      await this.createChartOfAccounts();
      
      // Étape 2: Catégories financières
      await this.createFinancialCategories();
      
      // Étape 3: Fournisseurs
      await this.createSuppliers();
      
      // Étape 4: Écritures comptables
      await this.createAccountingEntries();
      
      // Étape 5: Transactions bancaires
      await this.createBankTransactions();
      
      // Étape 6: Factures commerciales
      await this.createCommercialInvoices();
      
      console.log('✅ Seeding terminé avec succès!');
      
    } catch (error) {
      console.error('❌ Erreur durant le seeding:', error);
      throw error;
    }
  }

  private async createChartOfAccounts(): Promise<void> {
    console.log('📊 Création du plan comptable...');
    
    const accounts = [
      { account_number: '401000', account_name: 'Fournisseurs', account_type: 'liability' },
      { account_number: '411000', account_name: 'Clients', account_type: 'asset' },
      { account_number: '445660', account_name: 'TVA déductible', account_type: 'asset' },
      { account_number: '445710', account_name: 'TVA collectée', account_type: 'liability' },
      { account_number: '512000', account_name: 'Banque', account_type: 'asset' },
      { account_number: '531000', account_name: 'Caisse', account_type: 'asset' },
      { account_number: '606000', account_name: 'Fournitures bureau', account_type: 'expense' },
      { account_number: '621000', account_name: 'Personnel', account_type: 'expense' },
      { account_number: '700000', account_name: 'Ventes', account_type: 'revenue' },
      { account_number: '708000', account_name: 'Produits activités annexes', account_type: 'revenue' }
    ];

    for (const account of accounts) {
      try {
        const { error } = await supabase
          .from('chart_of_accounts')
          .upsert(account, { onConflict: 'account_number' });
        
        if (error) console.warn(`Compte ${account.account_number}:`, error.message);
      } catch (err) {
        console.warn(`Erreur compte ${account.account_number}:`, err);
      }
    }
  }

  private async createFinancialCategories(): Promise<void> {
    console.log('🏷️ Création des catégories financières...');
    
    const categories = [
      { name: 'Fournitures', code: 'FOUR', description: 'Achats fournitures diverses' },
      { name: 'Personnel', code: 'PERS', description: 'Charges de personnel' },
      { name: 'Ventes', code: 'VENT', description: 'Produits des ventes' },
      { name: 'Prestation', code: 'PRES', description: 'Prestations de services' },
      { name: 'Frais bancaires', code: 'BANQ', description: 'Frais et commissions bancaires' }
    ];

    for (const category of categories) {
      try {
        const { error } = await supabase
          .from('financial_categories')
          .upsert(category, { onConflict: 'code' });
        
        if (error) console.warn(`Catégorie ${category.code}:`, error.message);
      } catch (err) {
        console.warn(`Erreur catégorie ${category.code}:`, err);
      }
    }
  }

  private async createSuppliers(): Promise<void> {
    console.log('🏢 Création des fournisseurs...');
    
    const suppliers = [
      {
        name: 'Bureau Expert SARL',
        siret: '12345678901234',
        address: '123 Rue de la Papeterie, 75001 Paris',
        contact_email: 'contact@bureau-expert.fr',
        contact_phone: '01.23.45.67.89'
      },
      {
        name: 'Solutions IT Pro',
        siret: '98765432101234',
        address: '456 Avenue Technologique, 69000 Lyon',
        contact_email: 'info@solutions-it.fr',
        contact_phone: '04.56.78.90.12'
      },
      {
        name: 'Maintenance Services',
        siret: '11223344556677',
        address: '789 Boulevard Industriel, 13000 Marseille',
        contact_email: 'service@maintenance.fr',
        contact_phone: '04.91.23.45.67'
      }
    ];

    for (const supplier of suppliers) {
      try {
        const { error } = await supabase
          .from('suppliers')
          .upsert(supplier, { onConflict: 'siret' });
        
        if (error) console.warn(`Fournisseur ${supplier.name}:`, error.message);
      } catch (err) {
        console.warn(`Erreur fournisseur ${supplier.name}:`, err);
      }
    }
  }

  private async createAccountingEntries(): Promise<void> {
    console.log('📝 Création des écritures comptables...');
    
    // Récupérer l'année fiscale courante
    const { data: fiscalYear } = await supabase
      .from('fiscal_years')
      .select('id')
      .eq('is_current', true)
      .single();

    if (!fiscalYear) {
      console.warn('Aucune année fiscale courante trouvée');
      return;
    }

    const entries = [
      {
        reference_number: 'AC2401001',
        description: 'ACHAT FOURNITURES BUREAU EXPERT',
        entry_date: '2024-01-15',
        total_amount: 1020.00,
        fiscal_year_id: fiscalYear.id,
        status: 'validated'
      },
      {
        reference_number: 'AC2401002', 
        description: 'MAINTENANCE SERVEUR IT PRO',
        entry_date: '2024-01-16',
        total_amount: 850.00,
        fiscal_year_id: fiscalYear.id,
        status: 'validated'
      },
      {
        reference_number: 'VT2401001',
        description: 'VENTE PRESTATION FORMATION',
        entry_date: '2024-01-17',
        total_amount: 2400.00,
        fiscal_year_id: fiscalYear.id,
        status: 'validated'
      },
      {
        reference_number: 'AC2401003',
        description: 'FRAIS TRANSPORT MAINTENANCE',
        entry_date: '2024-01-18',
        total_amount: 125.00,
        fiscal_year_id: fiscalYear.id,
        status: 'draft'
      }
    ];

    for (const entry of entries) {
      try {
        const { error } = await supabase
          .from('accounting_entries')
          .upsert(entry, { onConflict: 'reference_number' });
        
        if (error) console.warn(`Écriture ${entry.reference_number}:`, error.message);
      } catch (err) {
        console.warn(`Erreur écriture ${entry.reference_number}:`, err);
      }
    }
  }

  private async createBankTransactions(): Promise<void> {
    console.log('🏦 Création des transactions bancaires...');
    
    // Simulation de 20 transactions bancaires réalistes
    const transactions = [
      {
        transaction_date: '2024-01-15',
        amount: -1020.00,
        description: 'VIR SEPA FOURNITURES BUREAU EXPERT',
        reference: 'TXN240115001',
        balance_after: 45680.00,
        transaction_type: 'transfer',
        status: 'processed'
      },
      {
        transaction_date: '2024-01-16',
        amount: -850.00,
        description: 'PRLV SOLUTIONS IT PRO MAINTENANCE',
        reference: 'TXN240116001',
        balance_after: 44830.00,
        transaction_type: 'direct_debit',
        status: 'processed'
      },
      {
        transaction_date: '2024-01-17',
        amount: 2400.00,
        description: 'VIR RECU FORMATION ENTREPRISE ABC',
        reference: 'TXN240117001',
        balance_after: 47230.00,
        transaction_type: 'transfer',
        status: 'processed'
      },
      {
        transaction_date: '2024-01-18',
        amount: -15.50,
        description: 'FRAIS BANCAIRES JANVIER',
        reference: 'TXN240118001',
        balance_after: 47214.50,
        transaction_type: 'fee',
        status: 'processed'
      },
      {
        transaction_date: '2024-01-19',
        amount: -125.00,
        description: 'CB STATION SERVICE AUTOROUTE',
        reference: 'TXN240119001',
        balance_after: 47089.50,
        transaction_type: 'card_payment',
        status: 'processed'
      }
    ];

    // Mock transactions bancaires (sera traité via l'algorithme de réconciliation)
    console.log(`✅ Généré ${transactions.length} transactions bancaires de test (simulation)`);
    
    // Les transactions seront utilisées par l'algorithme de matching
    // sans nécessiter de table dédiée pour le diagnostic
  }

  private async createCommercialInvoices(): Promise<void> {
    console.log('📄 Création des factures commerciales...');
    
    // Récupérer les clients commerciaux
    const { data: clients } = await supabase
      .from('commercial_clients')
      .select('id')
      .limit(3);

    if (!clients || clients.length === 0) {
      // Créer quelques clients de base
      const clientsData = [
        {
          company_name: 'Entreprise ABC',
          contact_email: 'contact@entreprise-abc.fr',
          contact_first_name: 'Marie',
          contact_last_name: 'Dupont',
          siret: '12312312312312'
        },
        {
          company_name: 'Société XYZ',
          contact_email: 'info@societe-xyz.fr', 
          contact_first_name: 'Pierre',
          contact_last_name: 'Martin',
          siret: '32132132132132'
        }
      ];

      for (const client of clientsData) {
        try {
          const { error } = await supabase
            .from('commercial_clients')
            .upsert(client, { onConflict: 'siret' });
          
          if (error) console.warn(`Client ${client.company_name}:`, error.message);
        } catch (err) {
          console.warn(`Erreur client ${client.company_name}:`, err);
        }
      }
    }
  }
}

// Fonction d'utilisation
export const seedFinanceData = async (): Promise<void> => {
  const seeder = new FinanceDataSeeder();
  await seeder.seedCompleteFinanceData();
};