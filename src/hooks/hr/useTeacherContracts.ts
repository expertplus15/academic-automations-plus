import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TeacherContract {
  id: string;
  teacher_profile_id: string;
  contract_type: string;
  start_date: string;
  end_date?: string | null;
  weekly_hours: number;
  hourly_rate?: number | null;
  monthly_salary?: number | null;
  status: string;
  contract_terms: any;
  signed_date?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  // Legacy compatibility properties
  teacher_id?: string;
  contract_type_id?: string;
  contract_number?: string;
  salary_amount?: number;
  working_hours_per_week?: number;
  renewal_date?: string;
  termination_reason?: string;
  benefits?: Record<string, any>;
  // Relations
  teacher_profile?: {
    employee_number: string;
    profile: {
      full_name?: string | null;
      email: string;
    } | null;
  } | null;
  contract_type_relation?: {
    name: string;
    code: string;
    salary_type: string;
  };
}

export function useTeacherContracts() {
  const [contracts, setContracts] = useState<TeacherContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teacher_contracts')
        .select(`
          *,
          teacher_profile:teacher_profiles(
            employee_number,
            profile:profiles(full_name, email)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des contrats';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createContract = async (contractData: any) => {
    try {
      const { data, error } = await supabase
        .from('teacher_contracts')
        .insert([contractData])
        .select(`
          *,
          teacher_profile:teacher_profiles(
            employee_number,
            profile:profiles(full_name, email)
          )
        `)
        .single();

      if (error) throw error;

      setContracts(prev => [data as TeacherContract, ...prev]);
      toast({
        title: "Succès",
        description: "Contrat créé avec succès",
      });
      
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création';
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return { data: null, error: message };
    }
  };

  const updateContract = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('teacher_contracts')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          teacher_profile:teacher_profiles(
            employee_number,
            profile:profiles(full_name, email)
          )
        `)
        .single();

      if (error) throw error;

      setContracts(prev => prev.map(contract => 
        contract.id === id ? { ...contract, ...data } : contract
      ));
      
      toast({
        title: "Succès",
        description: "Contrat mis à jour avec succès",
      });
      
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return { data: null, error: message };
    }
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