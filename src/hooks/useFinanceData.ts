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

export interface Invoice {
  id: string;
  student_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  notes: string | null;
  student: {
    student_number: string;
    profile: {
      full_name: string;
    };
  };
}

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

export function useFinanceData() {
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
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

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          student:students!inner (
            student_number,
            profile:profiles!inner (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const createInvoice = async (invoiceData: {
    student_id: string;
    fiscal_year_id: string;
    due_date: string;
    invoice_number: string;
    subtotal?: number;
    tax_amount?: number;
    total_amount?: number;
    notes?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Facture créée avec succès",
      });

      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture",
        variant: "destructive",
      });
      throw error;
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
    fetchAccounts();
    fetchInvoices();
    fetchPayments();
  }, []);

  return {
    accounts,
    invoices,
    payments,
    loading,
    fetchAccounts,
    fetchInvoices,
    fetchPayments,
    createInvoice,
    createPayment,
  };
}