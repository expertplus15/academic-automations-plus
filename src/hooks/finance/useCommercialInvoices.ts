import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InvoiceLine {
  id?: string;
  service_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  line_total: number;
}

export interface CommercialInvoice {
  id: string;
  invoice_number: string;
  client_id: string;
  quotation_id?: string;
  title: string;
  description?: string;
  invoice_date: string;
  due_date?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  payment_method?: string;
  payment_date?: string;
  notes?: string;
  terms_conditions?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  client?: {
    company_name: string;
    contact_email?: string;
    payment_terms: number;
  };
  commercial_invoice_lines?: InvoiceLine[];
}

export interface CreateInvoiceData {
  client_id: string;
  quotation_id?: string;
  title: string;
  description?: string;
  due_date?: string;
  notes?: string;
  terms_conditions?: string;
  lines: Omit<InvoiceLine, 'id'>[];
}

export function useCommercialInvoices() {
  const [invoices, setInvoices] = useState<CommercialInvoice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('commercial_invoices')
        .select(`
          *,
          client:commercial_clients!inner(company_name, contact_email, payment_terms),
          commercial_invoice_lines(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices((data || []) as CommercialInvoice[]);
    } catch (error) {
      console.error('Error fetching commercial invoices:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures commerciales",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_commercial_invoice_number');
    if (error) throw error;
    return data;
  };

  const calculateTotals = (lines: Omit<InvoiceLine, 'id'>[], taxRate: number = 20) => {
    const subtotal = lines.reduce((sum, line) => {
      const lineTotal = line.quantity * line.unit_price * (1 - line.discount_percentage / 100);
      return sum + lineTotal;
    }, 0);
    
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    return { subtotal, taxAmount, totalAmount };
  };

  const createInvoice = async (invoiceData: CreateInvoiceData) => {
    try {
      const invoiceNumber = await generateInvoiceNumber();
      const { subtotal, taxAmount, totalAmount } = calculateTotals(invoiceData.lines);

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('commercial_invoices')
        .insert({
          invoice_number: invoiceNumber,
          client_id: invoiceData.client_id,
          quotation_id: invoiceData.quotation_id,
          title: invoiceData.title,
          description: invoiceData.description,
          due_date: invoiceData.due_date,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          notes: invoiceData.notes,
          terms_conditions: invoiceData.terms_conditions
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice lines
      const linesWithTotals = invoiceData.lines.map(line => ({
        invoice_id: invoice.id,
        service_name: line.service_name,
        description: line.description,
        quantity: line.quantity,
        unit_price: line.unit_price,
        discount_percentage: line.discount_percentage,
        line_total: line.quantity * line.unit_price * (1 - line.discount_percentage / 100)
      }));

      const { error: linesError } = await supabase
        .from('commercial_invoice_lines')
        .insert(linesWithTotals);

      if (linesError) throw linesError;

      await fetchInvoices();
      toast({
        title: "Succès",
        description: `Facture ${invoiceNumber} créée avec succès`
      });
      
      return { data: invoice, error: null };
    } catch (error) {
      console.error('Error creating commercial invoice:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture commerciale",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateInvoiceStatus = async (id: string, status: CommercialInvoice['status']) => {
    try {
      const { data, error } = await supabase
        .from('commercial_invoices')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInvoices(prev => prev.map(invoice => 
        invoice.id === id ? { ...invoice, status } : invoice
      ));
      
      toast({
        title: "Succès",
        description: "Statut de la facture mis à jour"
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const recordPayment = async (id: string, amount: number, paymentMethod: string, paymentDate: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === id);
      if (!invoice) throw new Error('Facture non trouvée');

      const newPaidAmount = invoice.paid_amount + amount;
      const newStatus = newPaidAmount >= invoice.total_amount ? 'paid' : 'partially_paid';

      const { data, error } = await supabase
        .from('commercial_invoices')
        .update({
          paid_amount: newPaidAmount,
          status: newStatus,
          payment_method: paymentMethod,
          payment_date: paymentDate
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInvoices(prev => prev.map(invoice => 
        invoice.id === id ? { ...invoice, ...data } as CommercialInvoice : invoice
      ));
      
      toast({
        title: "Succès",
        description: "Paiement enregistré avec succès"
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const getInvoiceById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('commercial_invoices')
        .select(`
          *,
          client:commercial_clients!inner(*),
          commercial_invoice_lines(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return { data: null, error };
    }
  };

  const getOverdueInvoices = () => {
    const today = new Date().toISOString().split('T')[0];
    return invoices.filter(invoice => 
      invoice.status === 'sent' && 
      invoice.due_date && 
      invoice.due_date < today
    );
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoiceStatus,
    recordPayment,
    getInvoiceById,
    getOverdueInvoices,
    refetchInvoices: fetchInvoices
  };
}