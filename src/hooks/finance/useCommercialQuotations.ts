import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface QuotationLine {
  id?: string;
  service_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  line_total: number;
}

export interface CommercialQuotation {
  id: string;
  quotation_number: string;
  client_id: string;
  title: string;
  description?: string;
  quotation_date: string;
  valid_until?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  terms_conditions?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  client?: {
    company_name: string;
    contact_email?: string;
  };
  quotation_lines?: QuotationLine[];
}

export interface CreateQuotationData {
  client_id: string;
  title: string;
  description?: string;
  valid_until?: string;
  notes?: string;
  terms_conditions?: string;
  lines: Omit<QuotationLine, 'id'>[];
}

export function useCommercialQuotations() {
  const [quotations, setQuotations] = useState<CommercialQuotation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('commercial_quotations')
        .select(`
          *,
          client:commercial_clients!inner(company_name, contact_email),
          quotation_lines(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations((data || []) as CommercialQuotation[]);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les devis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQuotationNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_quotation_number');
    if (error) throw error;
    return data;
  };

  const calculateTotals = (lines: Omit<QuotationLine, 'id'>[], taxRate: number = 20) => {
    const subtotal = lines.reduce((sum, line) => {
      const lineTotal = line.quantity * line.unit_price * (1 - line.discount_percentage / 100);
      return sum + lineTotal;
    }, 0);
    
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    return { subtotal, taxAmount, totalAmount };
  };

  const createQuotation = async (quotationData: CreateQuotationData) => {
    try {
      const quotationNumber = await generateQuotationNumber();
      const { subtotal, taxAmount, totalAmount } = calculateTotals(quotationData.lines);

      // Create quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('commercial_quotations')
        .insert({
          quotation_number: quotationNumber,
          client_id: quotationData.client_id,
          title: quotationData.title,
          description: quotationData.description,
          valid_until: quotationData.valid_until,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          notes: quotationData.notes,
          terms_conditions: quotationData.terms_conditions
        })
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Create quotation lines
      const linesWithTotals = quotationData.lines.map(line => ({
        quotation_id: quotation.id,
        service_name: line.service_name,
        description: line.description,
        quantity: line.quantity,
        unit_price: line.unit_price,
        discount_percentage: line.discount_percentage,
        line_total: line.quantity * line.unit_price * (1 - line.discount_percentage / 100)
      }));

      const { error: linesError } = await supabase
        .from('quotation_lines')
        .insert(linesWithTotals);

      if (linesError) throw linesError;

      await fetchQuotations();
      toast({
        title: "Succès",
        description: `Devis ${quotationNumber} créé avec succès`
      });
      
      return { data: quotation, error: null };
    } catch (error) {
      console.error('Error creating quotation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le devis",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateQuotationStatus = async (id: string, status: CommercialQuotation['status']) => {
    try {
      const { data, error } = await supabase
        .from('commercial_quotations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setQuotations(prev => prev.map(quotation => 
        quotation.id === id ? { ...quotation, status } : quotation
      ));
      
      toast({
        title: "Succès",
        description: "Statut du devis mis à jour"
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating quotation status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const getQuotationById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('commercial_quotations')
        .select(`
          *,
          client:commercial_clients!inner(*),
          quotation_lines(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching quotation:', error);
      return { data: null, error };
    }
  };

  const convertToInvoice = async (quotationId: string) => {
    try {
      // This will be implemented with the invoice creation logic
      toast({
        title: "Fonction à venir",
        description: "La conversion en facture sera disponible prochainement"
      });
      return { data: null, error: null };
    } catch (error) {
      console.error('Error converting to invoice:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return {
    quotations,
    loading,
    createQuotation,
    updateQuotationStatus,
    getQuotationById,
    convertToInvoice,
    refetchQuotations: fetchQuotations
  };
}