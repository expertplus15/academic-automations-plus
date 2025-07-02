import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BudgetItem {
  id: string;
  name: string;
  code: string;
  budgeted_amount: number;
  actual_amount: number | null;
  variance: number | null;
  fiscal_year_id: string;
  financial_category_id: string;
  department_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  financial_category?: {
    name: string;
    code: string;
    category_type: string;
  };
  department?: {
    name: string;
    code: string;
  };
}

export function useBudgetItems() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBudgetItems = async (fiscalYearId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('budget_items')
        .select(`
          *,
          financial_category:financial_categories (
            name,
            code,
            category_type
          ),
          department:departments (
            name,
            code
          )
        `)
        .order('created_at', { ascending: false });

      if (fiscalYearId) {
        query = query.eq('fiscal_year_id', fiscalYearId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBudgetItems(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les postes budgétaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBudgetItem = async (budgetItemData: {
    name: string;
    code: string;
    budgeted_amount: number;
    fiscal_year_id: string;
    financial_category_id: string;
    department_id?: string;
    notes?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .insert([{ ...budgetItemData, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Poste budgétaire créé avec succès",
      });

      await fetchBudgetItems();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le poste budgétaire",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBudgetItem = async (id: string, updates: Partial<BudgetItem>) => {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Poste budgétaire mis à jour avec succès",
      });

      await fetchBudgetItems();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le poste budgétaire",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchBudgetItems();
  }, []);

  return {
    budgetItems,
    loading,
    fetchBudgetItems,
    createBudgetItem,
    updateBudgetItem,
  };
}