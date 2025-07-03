import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ContractType {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_permanent: boolean;
  default_duration_months?: number;
  requires_renewal: boolean;
  salary_type: 'hourly' | 'monthly' | 'annual' | 'per_session';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useContractTypes() {
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContractTypes = async () => {
    try {
      setLoading(true);
      // Temporaire: données factices en attendant la mise à jour des types
      setContractTypes([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createContractType = async (contractTypeData: Partial<ContractType>) => {
    // Temporaire: retourne une erreur en attendant la mise à jour des types
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const updateContractType = async (id: string, updates: Partial<ContractType>) => {
    // Temporaire: retourne une erreur en attendant la mise à jour des types
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  useEffect(() => {
    fetchContractTypes();
  }, []);

  return {
    contractTypes,
    loading,
    error,
    createContractType,
    updateContractType,
    refreshContractTypes: fetchContractTypes
  };
}