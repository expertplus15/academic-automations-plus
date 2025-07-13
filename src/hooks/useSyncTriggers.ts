import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from './module-sync/useModuleSync';
import SyncManager from '@/utils/SyncManager';

export function useSyncTriggers() {
  const { publishEvent } = useModuleSync();
  const channelsRef = useRef<any[]>([]);
  const syncManager = SyncManager.getInstance();

  useEffect(() => {
    // Éviter la double initialisation via le singleton
    if (syncManager.initialize()) return;
    syncManager.setInitialized(true);

    // Nettoyer les anciens canaux s'il y en a
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    // Créer un canal unique pour tous les événements de synchronisation
    const syncChannel = supabase
      .channel(`sync-triggers-${Date.now()}`) // Nom unique avec timestamp
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'students'
      }, async (payload) => {
        const data = payload.new || payload.old;
        await publishEvent('students', `student_${payload.eventType}`, {
          id: (data as any)?.id,
          data: data,
          timestamp: new Date().toISOString()
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_grades'
      }, async (payload) => {
        const data = payload.new || payload.old;
        await publishEvent('academic', `grade_${payload.eventType}`, {
          id: (data as any)?.id,
          student_id: (data as any)?.student_id,
          data: data,
          timestamp: new Date().toISOString()
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'exams'
      }, async (payload) => {
        const data = payload.new || payload.old;
        await publishEvent('exams', `exam_${payload.eventType}`, {
          id: (data as any)?.id,
          data: data,
          timestamp: new Date().toISOString()
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'exam_registrations'
      }, async (payload) => {
        const data = payload.new || payload.old;
        await publishEvent('exams', `registration_${payload.eventType}`, {
          id: (data as any)?.id,
          exam_id: (data as any)?.exam_id,
          student_id: (data as any)?.student_id,
          data: data,
          timestamp: new Date().toISOString()
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'timetables'
      }, async (payload) => {
        const data = payload.new || payload.old;
        await publishEvent('academic', `timetable_${payload.eventType}`, {
          id: (data as any)?.id,
          data: data,
          timestamp: new Date().toISOString()
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'exam_sessions'
      }, async (payload) => {
        const data = payload.new || payload.old;
        await publishEvent('exams', `session_${payload.eventType}`, {
          id: (data as any)?.id,
          exam_id: (data as any)?.exam_id,
          data: data,
          timestamp: new Date().toISOString()
        });
      })
      .subscribe();

    channelsRef.current.push(syncChannel);

    return () => {
      syncManager.reset(supabase);
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [publishEvent]);

  return {
    // Hook pour déclencher manuellement des synchronisations
    triggerManualSync: async (module: string, eventType: string, data: any) => {
      await publishEvent(module, eventType, data);
    }
  };
}