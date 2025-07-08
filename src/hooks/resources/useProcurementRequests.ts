import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProcurementRequest {
  id: string;
  request_number: string;
  requested_by: string;
  category_id?: string;
  title: string;
  description: string;
  quantity: number;
  unit_price?: number;
  total_amount: number;
  justification?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'ordered' | 'received' | 'cancelled';
  budget_year: number;
  expected_delivery_date?: string;
  supplier_preference?: string;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    code: string;
  };
  requester?: {
    id: string;
    full_name: string;
  };
  approver?: {
    id: string;
    full_name: string;
  };
}

export function useProcurementRequests() {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('procurement_requests')
        .select(`
          *,
          category:asset_categories(id, name, code)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data as unknown as ProcurementRequest[]) || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes d'achat",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: Partial<ProcurementRequest>) => {
    try {
      const { data, error } = await supabase
        .from('procurement_requests')
        .insert({
          ...requestData,
          status: requestData.status || 'draft'
        } as any)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests();
      toast({
        title: "Succès",
        description: "Demande d'achat créée avec succès",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateRequest = async (id: string, updates: Partial<ProcurementRequest>) => {
    try {
      const { data, error } = await supabase
        .from('procurement_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests();
      toast({
        title: "Succès",
        description: "Demande mise à jour avec succès",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const submitRequest = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('procurement_requests')
        .update({ status: 'submitted' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests();
      toast({
        title: "Succès",
        description: "Demande soumise pour approbation",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const approveRequest = async (id: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('procurement_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approval_notes: notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests();
      toast({
        title: "Succès",
        description: "Demande approuvée avec succès",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const rejectRequest = async (id: string, reason: string) => {
    try {
      const { data, error } = await supabase
        .from('procurement_requests')
        .update({
          status: 'rejected',
          approval_notes: reason
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests();
      toast({
        title: "Succès",
        description: "Demande rejetée",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const getApprovalThreshold = (userRole: string): number => {
    switch (userRole) {
      case 'admin': return Infinity;
      case 'finance': return 10000;
      case 'hr': return 5000;
      default: return 1000;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    submitRequest,
    approveRequest,
    rejectRequest,
    getApprovalThreshold
  };
}