import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProcurementRequest {
  id: string;
  request_number: string;
  title: string;
  description?: string;
  category_id?: string;
  requested_by: string;
  department_id?: string;
  priority: string;
  estimated_cost?: number;
  budget_category_id?: string;
  supplier_id?: string;
  delivery_date?: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  category?: {
    name: string;
    code: string;
  };
  requester?: {
    full_name: string;
    email: string;
  };
  department?: {
    name: string;
  };
  supplier?: {
    name: string;
  };
  items?: ProcurementItem[];
}

export interface ProcurementItem {
  id: string;
  request_id: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  specifications?: string;
}

export function useProcurement() {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('procurement_requests')
        .select(`
          *,
          category:asset_categories(name, code),
          requester:profiles!requested_by(full_name, email),
          department:departments(name),
          supplier:suppliers(name),
          items:procurement_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes d'approvisionnement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: any, items: any[]) => {
    try {
      const { data: requestNumber } = await supabase.rpc('generate_procurement_number');
      
      const { data: request, error: requestError } = await supabase
        .from('procurement_requests')
        .insert({
          ...requestData,
          request_number: requestNumber
        })
        .select()
        .single();

      if (requestError) throw requestError;

      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from('procurement_items')
          .insert(items.map(item => ({ ...item, request_id: request.id })));

        if (itemsError) throw itemsError;
      }
      
      await fetchRequests();
      toast({
        title: "Succès",
        description: "Demande d'approvisionnement créée avec succès",
      });
      
      return request;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateRequestStatus = async (id: string, status: ProcurementRequest['status'], rejection_reason?: string) => {
    try {
      const { data, error } = await supabase
        .from('procurement_requests')
        .update({
          status,
          rejection_reason,
          approved_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchRequests();
      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
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

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequestStatus
  };
}