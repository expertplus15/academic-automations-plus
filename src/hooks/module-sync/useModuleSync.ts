
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '../useErrorHandler';
import { ModuleSyncEvent, SyncConfiguration } from './types';
import { handleSyncAction } from './eventHandler';

export function useModuleSync() {
  const [syncEvents, setSyncEvents] = useState<ModuleSyncEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [syncConfig, setSyncConfig] = useState<SyncConfiguration>({
    enabledModules: ['exams', 'academic', 'students', 'resources', 'hr'],
    syncRules: {
      'exams': ['academic', 'students', 'resources', 'hr'],
      'academic': ['exams', 'students'],
      'students': ['exams', 'academic', 'results'],
      'resources': ['exams', 'academic'],
      'hr': ['exams', 'academic']
    },
    autoSync: true,
    batchSize: 10
  });
  const { handleError } = useErrorHandler();

  const publishEvent = useCallback(async (
    module: string,
    action: string,
    data: any
  ): Promise<ModuleSyncEvent> => {
    const event: ModuleSyncEvent = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      module,
      action,
      data,
      timestamp: new Date(),
      status: 'pending'
    };

    try {
      // Publier l'événement via Supabase Realtime
      const channel = supabase.channel('module_sync');
      await channel.send({
        type: 'broadcast',
        event: 'sync_event',
        payload: event
      });

      setSyncEvents(prev => [event, ...prev.slice(0, 99)]);
      return event;
    } catch (error) {
      handleError(error, { context: `Module Sync - ${module}` });
      throw error;
    }
  }, [handleError]);

  const processEvent = useCallback(async (event: ModuleSyncEvent) => {
    setSyncEvents(prev => 
      prev.map(e => 
        e.id === event.id 
          ? { ...e, status: 'processing' }
          : e
      )
    );

    try {
      // Process event using the separated handler
      await handleSyncAction(event, syncConfig, publishEvent);
      
      setSyncEvents(prev => 
        prev.map(e => 
          e.id === event.id 
            ? { ...e, status: 'completed' }
            : e
        )
      );
    } catch (error) {
      setSyncEvents(prev => 
        prev.map(e => 
          e.id === event.id 
            ? { ...e, status: 'failed' }
            : e
        )
      );
      handleError(error, { context: `Sync Processing - ${event.module}` });
    }
  }, [handleError, syncConfig, publishEvent]);

  // Setup real-time synchronization
  useEffect(() => {
    const channel = supabase.channel('module_sync')
      .on('broadcast', { event: 'sync_event' }, (payload) => {
        const event = payload.payload as ModuleSyncEvent;
        
        // Traiter l'événement si ce module est concerné
        const targetModules = syncConfig.syncRules[event.module] || [];
        if (targetModules.length > 0 && syncConfig.autoSync) {
          processEvent(event);
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [processEvent, syncConfig]);

  return {
    syncEvents,
    isConnected,
    syncConfig,
    setSyncConfig,
    publishEvent,
    processEvent
  };
}
