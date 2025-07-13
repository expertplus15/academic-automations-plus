import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SyncStatus {
  module: string;
  isConnected: boolean;
  lastSync: Date | null;
  pendingOperations: number;
  failedOperations: number;
}

export function useSyncStatus() {
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSyncStatuses = useCallback(async () => {
    try {
      setLoading(true);
      
      // Modules à surveiller
      const modules = ['academic', 'students', 'exams', 'results'];
      
      const statuses = await Promise.all(
        modules.map(async (module) => {
          // Récupérer les dernières opérations pour ce module
          const { data: operations } = await supabase
            .from('module_sync_operations')
            .select('*')
            .or(`source_module.eq.${module},target_module.eq.${module}`)
            .order('created_at', { ascending: false })
            .limit(10);

          // Calculer les statistiques
          const pendingOps = operations?.filter(op => op.status === 'pending').length || 0;
          const failedOps = operations?.filter(op => op.status === 'failed').length || 0;
          const lastSync = operations?.[0]?.created_at ? new Date(operations[0].created_at) : null;

          return {
            module,
            isConnected: true, // Connecté si on peut récupérer les données
            lastSync,
            pendingOperations: pendingOps,
            failedOperations: failedOps
          };
        })
      );

      setSyncStatuses(statuses);
    } catch (error) {
      console.error('Erreur récupération statuts sync:', error);
      // Marquer tous les modules comme déconnectés en cas d'erreur
      const modules = ['academic', 'students', 'exams', 'results'];
      setSyncStatuses(modules.map(module => ({
        module,
        isConnected: false,
        lastSync: null,
        pendingOperations: 0,
        failedOperations: 0
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSyncStatuses();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchSyncStatuses, 30000);
    
    return () => clearInterval(interval);
  }, [fetchSyncStatuses]);

  const getOverallSyncHealth = () => {
    if (syncStatuses.length === 0) return 'unknown';
    
    const disconnected = syncStatuses.filter(s => !s.isConnected).length;
    const withErrors = syncStatuses.filter(s => s.failedOperations > 0).length;
    
    if (disconnected > 0) return 'critical';
    if (withErrors > 0) return 'warning';
    return 'healthy';
  };

  return {
    syncStatuses,
    loading,
    overallHealth: getOverallSyncHealth(),
    refresh: fetchSyncStatuses
  };
}