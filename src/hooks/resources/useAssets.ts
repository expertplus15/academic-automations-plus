import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Asset {
  id: string;
  asset_number: string;
  name: string;
  description?: string;
  category_id?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  location?: string;
  room_id?: string;
  qr_code?: string;
  warranty_end_date?: string;
  status: string;
  condition_status: string;
  responsible_person_id?: string;
  created_at: string;
  category?: {
    name: string;
    code: string;
  };
  room?: {
    name: string;
  };
  responsible_person?: {
    full_name: string;
  };
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
          category:asset_categories(name, code),
          room:rooms(name),
          responsible_person:profiles!responsible_person_id(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les actifs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAsset = async (assetData: any) => {
    try {
      const { data: assetNumber } = await supabase.rpc('generate_asset_number');
      
      const { data, error } = await supabase
        .from('assets')
        .insert({
          ...assetData,
          asset_number: assetNumber
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchAssets();
      toast({
        title: "Succès",
        description: "Actif créé avec succès",
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
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchAssets();
      toast({
        title: "Succès",
        description: "Actif modifié avec succès",
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
        description: "Actif supprimé avec succès",
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