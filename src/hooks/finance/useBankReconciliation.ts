import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BankTransaction {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  balance?: number;
  reference?: string;
  transaction_type: 'credit' | 'debit';
  is_reconciled: boolean;
  reconciled_with?: string;
  reconciled_at?: string;
  import_batch_id?: string;
}

export interface ReconciliationMatch {
  bank_transaction: BankTransaction;
  accounting_entries: any[];
  match_score: number;
  match_type: 'exact' | 'partial' | 'manual';
}

export function useBankReconciliation() {
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [pendingMatches, setPendingMatches] = useState<ReconciliationMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchBankTransactions = async () => {
    try {
      setLoading(true);
      // Simuler des données de relevé bancaire pour la démo
      const mockTransactions: BankTransaction[] = [
        {
          id: '1',
          transaction_date: '2024-01-15',
          description: 'VIREMENT SALAIRES',
          amount: -45000,
          transaction_type: 'debit',
          is_reconciled: false
        },
        {
          id: '2', 
          transaction_date: '2024-01-16',
          description: 'PAIEMENT SCOLARITE DUPONT',
          amount: 2500,
          transaction_type: 'credit',
          is_reconciled: false
        }
      ];
      setBankTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching bank transactions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les transactions bancaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadBankStatement = async (file: File) => {
    try {
      setLoading(true);
      
      // Simuler le traitement du fichier
      const formData = new FormData();
      formData.append('file', file);
      
      // Dans une vraie implémentation, ceci appellerait une edge function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Succès",
        description: `Relevé bancaire importé: ${file.name}`,
      });

      // Simuler l'ajout de nouvelles transactions
      const newTransactions: BankTransaction[] = [
        {
          id: Date.now().toString(),
          transaction_date: new Date().toISOString().split('T')[0],
          description: `Import depuis ${file.name}`,
          amount: Math.random() * 5000 - 2500,
          transaction_type: Math.random() > 0.5 ? 'credit' : 'debit',
          is_reconciled: false,
          import_batch_id: Date.now().toString()
        }
      ];
      
      setBankTransactions(prev => [...newTransactions, ...prev]);
      
    } catch (error) {
      console.error('Error uploading bank statement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'import du relevé",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const autoMatch = async () => {
    try {
      setLoading(true);
      
      // Simuler la logique de rapprochement automatique
      const unreconciled = bankTransactions.filter(t => !t.is_reconciled);
      const matches: ReconciliationMatch[] = unreconciled.slice(0, 2).map(transaction => ({
        bank_transaction: transaction,
        accounting_entries: [], // Serait peuplé avec les vraies écritures
        match_score: Math.random() * 100,
        match_type: 'exact' as const
      }));
      
      setPendingMatches(matches);
      
      toast({
        title: "Rapprochement automatique terminé",
        description: `${matches.length} correspondances trouvées`,
      });
      
    } catch (error) {
      console.error('Error in auto-matching:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du rapprochement automatique",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateMatches = async (matches: ReconciliationMatch[]) => {
    try {
      // Simuler la validation des rapprochements
      const validated = matches.map(match => ({
        ...match.bank_transaction,
        is_reconciled: true,
        reconciled_at: new Date().toISOString()
      }));
      
      setBankTransactions(prev => 
        prev.map(t => {
          const validatedTransaction = validated.find(v => v.id === t.id);
          return validatedTransaction || t;
        })
      );
      
      setPendingMatches([]);
      
      toast({
        title: "Succès",
        description: `${matches.length} rapprochements validés`,
      });
      
    } catch (error) {
      console.error('Error validating matches:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la validation",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchBankTransactions();
  }, []);

  return {
    bankTransactions,
    pendingMatches,
    loading,
    uploadBankStatement,
    autoMatch,
    validateMatches,
    fetchBankTransactions,
  };
}