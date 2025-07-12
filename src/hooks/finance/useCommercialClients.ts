import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CommercialClient {
  id: string;
  company_name: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_phone?: string;
  siret?: string;
  vat_number?: string;
  billing_address?: string;
  shipping_address?: string;
  industry?: string;
  payment_terms: number;
  credit_limit?: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateCommercialClientData {
  company_name: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_phone?: string;
  siret?: string;
  vat_number?: string;
  billing_address?: string;
  shipping_address?: string;
  industry?: string;
  payment_terms?: number;
  credit_limit?: number;
  notes?: string;
}

export function useCommercialClients() {
  const [clients, setClients] = useState<CommercialClient[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('commercial_clients')
        .select('*')
        .eq('is_active', true)
        .order('company_name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching commercial clients:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients commerciaux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: CreateCommercialClientData) => {
    try {
      const { data, error } = await supabase
        .from('commercial_clients')
        .insert({
          ...clientData,
          payment_terms: clientData.payment_terms || 30
        })
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [...prev, data]);
      toast({
        title: "Succès",
        description: "Client commercial créé avec succès"
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating commercial client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le client commercial",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateClient = async (id: string, updates: Partial<CreateCommercialClientData>) => {
    try {
      const { data, error } = await supabase
        .from('commercial_clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...data } : client
      ));
      
      toast({
        title: "Succès",
        description: "Client commercial mis à jour"
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating commercial client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le client",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('commercial_clients')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      toast({
        title: "Succès",
        description: "Client commercial supprimé"
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting commercial client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client",
        variant: "destructive"
      });
      return { error };
    }
  };

  const getClientById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('commercial_clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching client:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    refetchClients: fetchClients
  };
}