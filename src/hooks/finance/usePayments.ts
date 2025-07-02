import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Payment {
  id: string;
  student_id: string;
  payment_number: string;
  amount: number;
  payment_date: string;
  status: string;
  transaction_reference: string | null;
  notes: string | null;
  payment_method: {
    name: string;
    code: string;
  };
  student: {
    student_number: string;
    profile: {
      full_name: string;
    };
  };
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          payment_method:payment_methods!inner (
            name,
            code
          ),
          student:students!inner (
            student_number,
            profile:profiles!inner (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: {
    student_id: string;
    payment_method_id: string;
    payment_number: string;
    amount: number;
    payment_date?: string;
    transaction_reference?: string;
    notes?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Paiement enregistré avec succès",
      });

      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    fetchPayments,
    createPayment,
  };
}