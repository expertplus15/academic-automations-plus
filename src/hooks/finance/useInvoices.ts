import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Invoice {
  id: string;
  student_id: string | null;
  fiscal_year_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  notes: string | null;
  invoice_type: string;
  recipient_name: string | null;
  recipient_email: string | null;
  recipient_address: string | null;
  student?: {
    student_number: string;
    profile: {
      full_name: string;
    };
  };
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          student:students (
            student_number,
            profile:profiles (
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

  const createInvoice = async (invoiceData: {
    student_id?: string | null;
    fiscal_year_id: string;
    due_date: string;
    invoice_number: string;
    subtotal?: number;
    tax_amount?: number;
    total_amount?: number;
    notes?: string;
    invoice_type?: string;
    recipient_name?: string;
    recipient_email?: string;
    recipient_address?: string;
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

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    fetchInvoices,
    createInvoice,
  };
}