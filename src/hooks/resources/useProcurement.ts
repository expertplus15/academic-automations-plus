import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProcurementRequest {
  id: string;
  request_number: string;
  title: string;
  description?: string;
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'delivered' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_cost?: number;
  actual_cost?: number;
  delivery_date?: string;
  requested_date?: string;
  approved_date?: string;
  items?: any[];
  requester?: {
    id: string;
    full_name: string;
  };
  approved_by?: {
    id: string;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
}

export function useProcurement() {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Mock data for now since procurement_requests table doesn't exist yet
      const mockData: ProcurementRequest[] = [
        {
          id: '1',
          request_number: 'PR240001',
          title: 'Ordinateurs portables pour laboratoire',
          description: 'Commande de 10 ordinateurs portables pour le nouveau laboratoire informatique',
          status: 'submitted',
          priority: 'high',
          estimated_cost: 15000,
          delivery_date: '2024-02-15',
          requested_date: '2024-01-15',
          items: [
            { name: 'Ordinateur portable HP', quantity: 10, unit_price: 1500 }
          ],
          requester: {
            id: '1',
            full_name: 'Jean Dupont'
          },
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          request_number: 'PR240002',
          title: 'Mobilier de bureau',
          description: 'Bureaux et chaises pour le nouveau bureau administratif',
          status: 'approved',
          priority: 'medium',
          estimated_cost: 5000,
          actual_cost: 4800,
          delivery_date: '2024-01-30',
          requested_date: '2024-01-10',
          approved_date: '2024-01-12',
          items: [
            { name: 'Bureau', quantity: 5, unit_price: 800 },
            { name: 'Chaise ergonomique', quantity: 5, unit_price: 200 }
          ],
          requester: {
            id: '2',
            full_name: 'Marie Martin'
          },
          approved_by: {
            id: '3',
            full_name: 'Pierre Admin'
          },
          created_at: '2024-01-10T14:00:00Z',
          updated_at: '2024-01-12T09:00:00Z'
        }
      ];

      setRequests(mockData);
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

  const createRequest = async (requestData: Partial<ProcurementRequest>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: ProcurementRequest = {
        id: Date.now().toString(),
        request_number: `PR24${(requests.length + 1).toString().padStart(4, '0')}`,
        title: requestData.title || '',
        description: requestData.description,
        status: 'draft',
        priority: requestData.priority || 'medium',
        estimated_cost: requestData.estimated_cost,
        delivery_date: requestData.delivery_date,
        requested_date: new Date().toISOString(),
        items: requestData.items || [],
        requester: {
          id: 'current-user',
          full_name: 'Utilisateur Actuel'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setRequests(prev => [newRequest, ...prev]);
      
      toast({
        title: "Succès",
        description: "Demande d'approvisionnement créée avec succès",
      });
      
      return newRequest;
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => prev.map(req => 
        req.id === id 
          ? { ...req, ...updates, updated_at: new Date().toISOString() }
          : req
      ));
      
      toast({
        title: "Succès",
        description: "Demande mise à jour avec succès",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const approveRequest = async (id: string) => {
    try {
      await updateRequest(id, { 
        status: 'approved', 
        approved_date: new Date().toISOString(),
        approved_by: {
          id: 'current-user',
          full_name: 'Utilisateur Actuel'
        }
      });
    } catch (err: any) {
      throw err;
    }
  };

  const rejectRequest = async (id: string, reason?: string) => {
    try {
      await updateRequest(id, { 
        status: 'rejected'
      });
    } catch (err: any) {
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
    updateRequest,
    approveRequest,
    rejectRequest
  };
}