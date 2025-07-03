import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeacherContract {
  id: string;
  teacher_id: string;
  contract_type_id: string;
  contract_number: string;
  start_date: string;
  end_date?: string;
  salary_amount: number;
  working_hours_per_week: number;
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'suspended';
  signed_date?: string;
  renewal_date?: string;
  termination_reason?: string;
  contract_terms?: Record<string, any>;
  benefits?: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Relations
  teacher_profile?: {
    employee_number: string;
    profile: {
      full_name: string;
      email: string;
    };
  };
  contract_type?: {
    name: string;
    code: string;
    salary_type: string;
  };
}

export function useTeacherContracts() {
  const [contracts, setContracts] = useState<TeacherContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      // Temporaire: données factices en attendant la mise à jour des types
      setContracts([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createContract = async (contractData: Partial<TeacherContract>) => {
    // Temporaire: retourne une erreur en attendant la mise à jour des types
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  const updateContract = async (id: string, updates: Partial<TeacherContract>) => {
    // Temporaire: retourne une erreur en attendant la mise à jour des types
    return { data: null, error: 'Fonction temporairement désactivée' };
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    error,
    createContract,
    updateContract,
    refreshContracts: fetchContracts
  };
}