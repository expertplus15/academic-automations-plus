import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface StudentAccount {
  id: string;
  student_id: string;
  fiscal_year_id: string;
  current_balance: number;
  total_charged: number;
  total_paid: number;
  last_payment_date: string | null;
  status: string;
  student: {
    student_number: string;
    profile: {
      full_name: string;
      email: string;
    };
  };
}

export function useStudentAccounts() {
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students_accounts')
        .select(`
          *,
          student:students!inner (
            student_number,
            profile:profiles!inner (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les comptes étudiants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    fetchAccounts,
  };
}