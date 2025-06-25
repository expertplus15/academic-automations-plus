import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from '../module-sync';
import { useErrorHandler } from '../useErrorHandler';
import { ExamResourceSync } from './types';
import { analyzeResourceRequirements } from './resourceAnalysis';
import { allocateResources, determineAvailabilityStatus } from './resourceAllocation';

export function useExamResourceIntegration() {
  const [integrationData, setIntegrationData] = useState<ExamResourceSync[]>([]);
  const [loading, setLoading] = useState(false);
  const { publishEvent } = useModuleSync();
  const { handleError } = useErrorHandler();

  const syncExamWithResources = useCallback(async (examId: string) => {
    try {
      setLoading(true);

      // Récupérer les données de l'examen
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select(`
          *,
          exam_sessions(*),
          subjects(*)
        `)
        .eq('id', examId)
        .single();

      if (examError) throw examError;

      // Analyser les besoins en ressources
      const resourceRequirements = await analyzeResourceRequirements(examData);
      
      // Allouer les ressources pour chaque session
      const allocations = await allocateResources(examData, resourceRequirements);
      
      // Vérifier la disponibilité globale
      const availabilityStatus = determineAvailabilityStatus(allocations);

      // Publier l'événement de synchronisation
      await publishEvent('exams', 'resource_sync_completed', {
        examId,
        resourceRequirements,
        allocations,
        availabilityStatus,
        timestamp: new Date()
      });

      // Mettre à jour l'état local
      const syncData: ExamResourceSync = {
        examId,
        resourceRequirements,
        allocations,
        availabilityStatus,
        syncStatus: allocations.some(a => a.allocationStatus === 'conflict') ? 'conflict' : 'synced',
        lastSyncAt: new Date()
      };

      setIntegrationData(prev => {
        const existing = prev.find(item => item.examId === examId);
        if (existing) {
          return prev.map(item => item.examId === examId ? syncData : item);
        } else {
          return [...prev, syncData];
        }
      });

      return { success: true, syncData };
    } catch (error) {
      handleError(error, { context: 'Exam Resource Integration' });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [publishEvent, handleError]);

  const resolveResourceConflict = useCallback(async (examId: string, sessionId: string, resolution: any) => {
    try {
      setLoading(true);
      
      // Appliquer la résolution du conflit
      // Cette logique dépend du type de conflit et de la résolution choisie
      
      // Re-synchroniser après résolution
      await syncExamWithResources(examId);

      await publishEvent('resources', 'conflict_resolved', {
        examId,
        sessionId,
        resolution,
        timestamp: new Date()
      });

    } catch (error) {
      handleError(error, { context: 'Resource Conflict Resolution' });
    } finally {
      setLoading(false);
    }
  }, [syncExamWithResources, publishEvent, handleError]);

  const getIntegrationStatus = useCallback((examId: string) => {
    return integrationData.find(item => item.examId === examId);
  }, [integrationData]);

  return {
    integrationData,
    loading,
    syncExamWithResources,
    resolveResourceConflict,
    getIntegrationStatus
  };
}
