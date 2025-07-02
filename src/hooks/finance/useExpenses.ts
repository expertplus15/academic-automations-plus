import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  expense_number: string;
  supplier_id: string;
  financial_category_id: string;
  amount: number;
  expense_date: string;
  due_date?: string;
  description: string;
  receipt_url?: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'paid';
  approved_by?: string;
  approved_at?: string;
  fiscal_year_id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  supplier?: {
    name: string;
    contact_email?: string;
  };
  financial_category?: {
    name: string;
    code: string;
  };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          supplier:suppliers(name, contact_email),
          financial_category:financial_categories(name, code)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses((data || []) as Expense[]);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les dépenses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData: Omit<Expense, 'id' | 'expense_number' | 'created_at' | 'updated_at' | 'supplier' | 'financial_category'>) => {
    try {
      const { data: expenseNumber } = await supabase.rpc('generate_expense_number');
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          expense_number: expenseNumber,
          ...expenseData
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Dépense créée avec succès",
      });

      await fetchExpenses();
      return data;
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la dépense",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Dépense mise à jour",
      });

      await fetchExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    fetchExpenses,
    createExpense,
    updateExpense,
  };
}