import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AssetMaintenance {
  id: string;
  asset_id: string;
  maintenance_type: 'preventive' | 'corrective' | 'inspection';
  scheduled_date: string;
  completed_date?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  cost?: number;
  performed_by?: string;
  next_maintenance_date?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  asset?: {
    id: string;
    name: string;
    asset_number: string;
  };
}

export function useAssetMaintenance() {
  const [maintenances, setMaintenances] = useState<AssetMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('asset_maintenance')
        .select(`
          *,
          asset:assets(id, name, asset_number)
        `)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setMaintenances((data as AssetMaintenance[]) || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les maintenances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMaintenance = async (maintenanceData: Omit<AssetMaintenance, 'id' | 'created_at' | 'updated_at' | 'asset'>) => {
    try {
      const { data, error } = await supabase
        .from('asset_maintenance')
        .insert(maintenanceData as any)
        .select()
        .single();

      if (error) throw error;
      
      await fetchMaintenances();
      toast({
        title: "Succès",
        description: "Maintenance planifiée avec succès",
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

  const updateMaintenance = async (id: string, updates: Partial<AssetMaintenance>) => {
    try {
      const { data, error } = await supabase
        .from('asset_maintenance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchMaintenances();
      toast({
        title: "Succès",
        description: "Maintenance mise à jour avec succès",
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

  const deleteMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('asset_maintenance')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchMaintenances();
      toast({
        title: "Succès",
        description: "Maintenance supprimée avec succès",
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

  const completeMaintenance = async (id: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('asset_maintenance')
        .update({
          status: 'completed',
          completed_date: new Date().toISOString(),
          notes: notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchMaintenances();
      toast({
        title: "Succès",
        description: "Maintenance marquée comme terminée",
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
    fetchMaintenances();
  }, []);

  return {
    maintenances,
    loading,
    error,
    fetchMaintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    completeMaintenance
  };
}