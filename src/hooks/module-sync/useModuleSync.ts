import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SyncOperation {
  id: string;
  source_module: string;
  target_module: string;
  operation_type: string;
  entity_id: string;
  entity_type: string;
  sync_data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  triggered_by: string | null;
  created_at: string;
  completed_at?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
}

export interface SyncConfiguration {
  id: string;
  source_module: string;
  target_module: string;
  operation_type: string;
  is_enabled: boolean;
  auto_sync: boolean;
  sync_frequency?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  last_sync_at?: string;
  next_sync_at?: string;
  sync_rules: any;
  created_at: string;
  updated_at: string;
}

export function useModuleSync() {
  const [syncOperations, setSyncOperations] = useState<SyncOperation[]>([]);
  const [syncConfigurations, setSyncConfigurations] = useState<SyncConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [syncEvents, setSyncEvents] = useState<any[]>([]);
  const [syncConfig, setSyncConfig] = useState({
    autoSync: true,
    enabledModules: ['hr', 'academic', 'finance', 'students'],
    batchSize: 10
  });

  const fetchSyncData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les opérations de synchronisation réelles
      const { data: operations, error: opsError } = await supabase
        .from('module_sync_operations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (opsError) throw opsError;
      
      // Récupérer les configurations de synchronisation
      const { data: configs, error: configsError } = await supabase
        .from('module_sync_configurations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (configsError) throw configsError;
      
      setSyncOperations((operations || []).map(op => ({
        ...op,
        sync_data: op.sync_data || {},
        triggered_by: op.triggered_by || null,
        status: (op.status as 'pending' | 'processing' | 'completed' | 'failed') || 'pending'
      })));
      setSyncConfigurations((configs || []).map(config => ({
        ...config,
        sync_rules: config.sync_rules || {},
        sync_frequency: (config.sync_frequency as 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual') || 'manual'
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async (configId: string, entityId?: string) => {
    try {
      const config = syncConfigurations.find(c => c.id === configId);
      if (!config) throw new Error('Configuration non trouvée');

      // Déclencher la synchronisation via la fonction DB
      const { data, error } = await supabase.rpc('trigger_module_sync', {
        p_source_module: config.source_module,
        p_target_module: config.target_module,
        p_operation_type: config.operation_type,
        p_entity_id: entityId || 'manual_trigger',
        p_entity_type: 'manual',
        p_sync_data: { triggered_manually: true }
      });

      if (error) throw error;

      // Actualiser les données
      await fetchSyncData();
      
      return { success: true, operationId: data };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur de synchronisation' 
      };
    }
  };

  const updateConfiguration = async (configId: string, updates: Partial<SyncConfiguration>) => {
    try {
      const { error } = await supabase
        .from('module_sync_configurations')
        .update(updates)
        .eq('id', configId);
      
      if (error) throw error;
      
      await fetchSyncData();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur de mise à jour' 
      };
    }
  };

  const retryFailedOperation = async (operationId: string) => {
    try {
      const operation = syncOperations.find(op => op.id === operationId);
      if (!operation || operation.retry_count >= operation.max_retries) {
        throw new Error('Impossible de relancer cette opération');
      }

      const { error } = await supabase
        .from('module_sync_operations')
        .update({ 
          status: 'pending',
          retry_count: operation.retry_count + 1,
          error_message: null
        })
        .eq('id', operationId);

      if (error) throw error;
      
      await fetchSyncData();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur de relance' 
      };
    }
  };

  const publishEvent = useCallback(async (module: string, eventType: string, data: any) => {
    try {
      const { error } = await supabase
        .from('sync_events')
        .insert({
          module,
          event_type: eventType,
          entity_id: data.id || data.entity_id || null,
          event_data: data
        });

      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error('Erreur publication événement:', err);
      return { success: false, error: err };
    }
  }, []);

  useEffect(() => {
    fetchSyncData();
    
    // Utiliser des noms de canaux uniques pour éviter les conflits
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    // Écouter les changements temps réel sur les opérations de sync
    const syncChannel = supabase
      .channel(`sync-operations-${timestamp}-${randomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'module_sync_operations'
      }, () => {
        fetchSyncData();
      })
      .subscribe();

    // Écouter les événements de synchronisation  
    const eventsChannel = supabase
      .channel(`sync-events-${timestamp}-${randomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sync_events'
      }, (payload) => {
        setSyncEvents(prev => [payload.new, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(syncChannel);
        supabase.removeChannel(eventsChannel);
      } catch (error) {
        console.warn('Erreur lors de la suppression des canaux:', error);
      }
    };
  }, []);

  return {
    syncOperations,
    syncConfigurations,
    loading,
    error,
    isConnected,
    syncEvents,
    syncConfig,
    triggerSync,
    updateConfiguration,
    retryFailedOperation,
    publishEvent,
    refreshSyncData: fetchSyncData
  };
}