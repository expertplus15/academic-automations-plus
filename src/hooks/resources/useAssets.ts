import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Asset {
  id: string;
  asset_number: string;
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  status: 'active' | 'maintenance' | 'retired' | 'reserved';
  condition_status: 'excellent' | 'good' | 'fair' | 'poor';
  location?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  depreciation_rate?: number;
  warranty_end_date?: string;
  qr_code?: string;
  category?: {
    id: string;
    name: string;
    code: string;
  };
  room?: {
    id: string;
    name: string;
  };
  responsible_person?: {
    id: string;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          category:asset_categories(id, name, code),
          room:rooms(id, name),
          responsible_person:profiles(id, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets((data as any) || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les équipements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAsset = async (assetData: Partial<Asset>) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert(assetData as any)
        .select()
        .single();

      if (error) throw error;
      
      await fetchAssets();
      toast({
        title: "Succès",
        description: "Équipement créé avec succès",
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

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchAssets();
      toast({
        title: "Succès",
        description: "Équipement mis à jour avec succès",
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

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchAssets();
      toast({
        title: "Succès",
        description: "Équipement supprimé avec succès",
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

  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    loading,
    error,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset
  };
}