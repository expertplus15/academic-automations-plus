import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FinancialCategory {
  id: string;
  name: string;
  code: string;
  description: string | null;
  category_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useFinancialCategories() {
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories financières",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: {
    name: string;
    code: string;
    description?: string;
    category_type: string;
    is_active?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Catégorie créée avec succès",
      });

      await fetchCategories();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<FinancialCategory>) => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès",
      });

      await fetchCategories();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
  };
}