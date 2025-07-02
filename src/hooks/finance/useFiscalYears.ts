import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FiscalYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useFiscalYears() {
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiscalYears = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fiscal_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setFiscalYears(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les années fiscales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFiscalYear = async (fiscalYearData: {
    name: string;
    start_date: string;
    end_date: string;
    is_current?: boolean;
    status?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('fiscal_years')
        .insert([fiscalYearData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Année fiscale créée avec succès",
      });

      await fetchFiscalYears();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'année fiscale",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateFiscalYear = async (id: string, updates: Partial<FiscalYear>) => {
    try {
      const { data, error } = await supabase
        .from('fiscal_years')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Année fiscale mise à jour avec succès",
      });

      await fetchFiscalYears();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'année fiscale",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchFiscalYears();
  }, []);

  return {
    fiscalYears,
    loading,
    fetchFiscalYears,
    createFiscalYear,
    updateFiscalYear,
  };
}