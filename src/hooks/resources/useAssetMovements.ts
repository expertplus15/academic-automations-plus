import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AssetMovement {
  id: string;
  asset_id: string;
  movement_type: 'transfer' | 'acquisition' | 'disposal' | 'maintenance' | 'loan';
  from_location?: string;
  to_location?: string;
  from_user_id?: string;
  to_user_id?: string;
  movement_date: string;
  reason?: string;
  document_url?: string;
  performed_by?: string;
  created_at: string;
  asset?: {
    id: string;
    name: string;
    asset_number: string;
  };
  from_user?: {
    id: string;
    full_name: string;
  };
  to_user?: {
    id: string;
    full_name: string;
  };
}

export function useAssetMovements() {
  const [movements, setMovements] = useState<AssetMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('asset_movements')
        .select(`
          *,
          asset:assets(id, name, asset_number)
        `)
        .order('movement_date', { ascending: false });

      if (error) throw error;
      setMovements((data as AssetMovement[]) || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des mouvements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMovement = async (movementData: Omit<AssetMovement, 'id' | 'created_at' | 'asset' | 'from_user' | 'to_user'>) => {
    try {
      const { data, error } = await supabase
        .from('asset_movements')
        .insert({
          ...movementData,
          movement_date: movementData.movement_date || new Date().toISOString().split('T')[0]
        } as any)
        .select()
        .single();

      if (error) throw error;
      
      // Update asset location if it's a transfer
      if (movementData.movement_type === 'transfer' && movementData.to_location && movementData.asset_id) {
        await supabase
          .from('assets')
          .update({ location: movementData.to_location })
          .eq('id', movementData.asset_id);
      }
      
      await fetchMovements();
      toast({
        title: "Succès",
        description: "Mouvement enregistré avec succès",
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

  const getMovementsByAsset = (assetId: string) => {
    return movements.filter(movement => movement.asset_id === assetId);
  };

  const getMovementsByType = (type: AssetMovement['movement_type']) => {
    return movements.filter(movement => movement.movement_type === type);
  };

  const getMovementsByDateRange = (startDate: string, endDate: string) => {
    return movements.filter(movement => 
      movement.movement_date >= startDate && movement.movement_date <= endDate
    );
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return {
    movements,
    loading,
    error,
    fetchMovements,
    createMovement,
    getMovementsByAsset,
    getMovementsByType,
    getMovementsByDateRange
  };
}