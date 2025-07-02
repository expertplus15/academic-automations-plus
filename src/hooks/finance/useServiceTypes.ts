import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ServiceType {
  id: string;
  name: string;
  code: string;
  description: string | null;
  default_price: number | null;
  is_taxable: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setServiceTypes(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createServiceType = async (serviceTypeData: {
    name: string;
    code: string;
    description?: string;
    default_price?: number;
    is_taxable?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .insert([serviceTypeData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Type de service créé avec succès",
      });

      await fetchServiceTypes();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le type de service",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  return {
    serviceTypes,
    loading,
    fetchServiceTypes,
    createServiceType,
  };
}