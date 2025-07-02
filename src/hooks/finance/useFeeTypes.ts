import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FeeType {
  id: string;
  name: string;
  code: string;
  description: string | null;
  fee_category: string;
  default_amount: number | null;
  is_percentage: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useFeeTypes() {
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFeeTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fee_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setFeeTypes(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de frais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFeeType = async (feeTypeData: {
    name: string;
    code: string;
    description?: string;
    fee_category: string;
    default_amount?: number;
    is_percentage?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('fee_types')
        .insert([feeTypeData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Type de frais créé avec succès",
      });

      await fetchFeeTypes();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le type de frais",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  return {
    feeTypes,
    loading,
    fetchFeeTypes,
    createFeeType,
  };
}