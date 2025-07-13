import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from './module-sync/useModuleSync';

export function useSyncTriggers() {
  const { publishEvent } = useModuleSync();

  useEffect(() => {
    // Déclencher sync quand un étudiant est inscrit/modifié
    const studentsChannel = supabase
      .channel('students-sync')
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
      .subscribe();

    // Déclencher sync pour les notes
    const gradesChannel = supabase
      .channel('grades-sync')
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
      .subscribe();

    // Déclencher sync pour les examens
    const examsChannel = supabase
      .channel('exams-sync')
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
      .subscribe();

    // Déclencher sync pour les inscriptions aux examens
    const examRegistrationsChannel = supabase
      .channel('exam-registrations-sync')
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
      .subscribe();

    // Déclencher sync pour les emplois du temps
    const timetablesChannel = supabase
      .channel('timetables-sync')
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
      .subscribe();

    // Déclencher sync pour les sessions d'examen
    const examSessionsChannel = supabase
      .channel('exam-sessions-sync')
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

    return () => {
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(gradesChannel);
      supabase.removeChannel(examsChannel);
      supabase.removeChannel(examRegistrationsChannel);
      supabase.removeChannel(timetablesChannel);
      supabase.removeChannel(examSessionsChannel);
    };
  }, [publishEvent]);

  return {
    // Hook pour déclencher manuellement des synchronisations
    triggerManualSync: async (module: string, eventType: string, data: any) => {
      await publishEvent(module, eventType, data);
    }
  };
}