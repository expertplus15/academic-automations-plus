import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AccountingEntry {
  id: string;
  reference_number: string;
  entry_date: string;
  description?: string;
  total_amount: number;
  status: string;
  fiscal_year_id?: string;
  created_by?: string;
  validated_by?: string;
  validated_at?: string;
  created_at: string;
  updated_at: string;
  lines?: AccountingEntryLine[];
}

export interface AccountingEntryLine {
  id: string;
  entry_id: string;
  account_id?: string;
  description?: string;
  debit_amount?: number;
  credit_amount?: number;
  account?: {
    account_number: string;
    account_name: string;
    account_type: string;
  };
}

export function useAccountingEntries() {
  const [entries, setEntries] = useState<AccountingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accounting_entries')
        .select(`
          *,
          lines:accounting_entry_lines(
            *,
            account:chart_of_accounts(account_number, account_name, account_type)
          )
        `)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries((data || []) as AccountingEntry[]);
    } catch (error) {
      console.error('Error fetching accounting entries:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les écritures comptables",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: {
    entry_date: string;
    description?: string;
    lines: {
      account_id: string;
      description?: string;
      debit_amount?: number;
      credit_amount?: number;
    }[];
  }) => {
    try {
      const total_amount = entryData.lines.reduce((sum, line) => 
        sum + (line.debit_amount || 0) + (line.credit_amount || 0), 0
      );

      const { data: entry, error: entryError } = await supabase
        .from('accounting_entries')
        .insert([{
          reference_number: `ECR${Date.now()}`,
          entry_date: entryData.entry_date,
          description: entryData.description,
          total_amount,
          status: 'draft'
        }])
        .select()
        .single();

      if (entryError) throw entryError;

      // Create entry lines
      const lines = entryData.lines.map(line => ({
        ...line,
        entry_id: entry.id
      }));

      const { error: linesError } = await supabase
        .from('accounting_entry_lines')
        .insert(lines);

      if (linesError) throw linesError;

      toast({
        title: "Succès",
        description: "Écriture comptable créée avec succès",
      });

      await fetchEntries();
      return entry;
    } catch (error) {
      console.error('Error creating accounting entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'écriture comptable",
        variant: "destructive",
      });
      throw error;
    }
  };

  const validateEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accounting_entries')
        .update({
          status: 'validated',
          validated_at: new Date().toISOString(),
          validated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Écriture validée avec succès",
      });

      await fetchEntries();
    } catch (error) {
      console.error('Error validating entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider l'écriture",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    fetchEntries,
    createEntry,
    validateEntry,
  };
}