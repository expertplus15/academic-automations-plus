import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChartOfAccount {
  id: string;
  account_number: string;
  account_name: string;
  account_type: 'actif' | 'passif' | 'charges' | 'produits';
  parent_account_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useChartOfAccounts() {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .order('account_number');

      if (error) throw error;
      setAccounts((data || []) as ChartOfAccount[]);
    } catch (error) {
      console.error('Error fetching chart of accounts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le plan comptable",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    fetchAccounts,
  };
}