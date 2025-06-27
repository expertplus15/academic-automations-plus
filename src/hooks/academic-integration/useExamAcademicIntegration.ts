
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from '../module-sync';
import { useErrorHandler } from '../useErrorHandler';
import { AcademicConstraint, ExamAcademicSync } from './types';
import { validateAcademicConstraints } from './constraintValidation';
import { syncWithTimetable, checkTeacherAvailability } from './timetableSync';

export function useExamAcademicIntegration() {
  const [integrationData, setIntegrationData] = useState<ExamAcademicSync[]>([]);
  const [loading, setLoading] = useState(false);
  const { publishEvent } = useModuleSync();
  const { handleError } = useErrorHandler();

  const syncExamWithAcademic = useCallback(async (examId: string) => {
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

      // Vérifier les contraintes académiques
      const validationResult = await validateAcademicConstraints(examData);
      
      // Convertir les violations en contraintes académiques
      const constraints: AcademicConstraint[] = validationResult.violations.map((violation, index) => ({
        id: `constraint-${index}`,
        type: violation.type as any,
        severity: violation.severity,
        description: violation.message,
        affectedEntities: violation.sessionId ? [violation.sessionId] : [],
        suggestedResolution: `Résoudre: ${violation.message}`
      }));
      
      // Synchroniser avec l'emploi du temps
      await syncWithTimetable(examData);
      
      // Vérifier la disponibilité des enseignants
      await checkTeacherAvailability(examData);
      
      // Publier l'événement de synchronisation
      await publishEvent('exams', 'academic_sync_completed', {
        examId,
        constraints,
        timestamp: new Date()
      });

      // Mettre à jour l'état local
      setIntegrationData(prev => {
        const existing = prev.find(item => item.examId === examId);
        const newItem: ExamAcademicSync = {
          examId,
          subjectId: examData.subject_id,
          programId: examData.program_id,
          academicYearId: examData.academic_year_id,
          constraints,
          syncStatus: constraints.some(c => c.severity === 'critical') ? 'conflict' : 'synced',
          lastSyncAt: new Date()
        };

        if (existing) {
          return prev.map(item => item.examId === examId ? newItem : item);
        } else {
          return [...prev, newItem];
        }
      });

      return { success: true, constraints };
    } catch (error) {
      handleError(error, { context: 'Exam Academic Integration' });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [publishEvent, handleError]);

  const resolveConstraint = useCallback(async (constraintId: string, resolution: string) => {
    try {
      setLoading(true);
      
      // Appliquer la résolution selon le type de contrainte
      // Cette logique dépend du type de contrainte et de la résolution choisie
      
      // Mettre à jour l'état local
      setIntegrationData(prev => 
        prev.map(item => ({
          ...item,
          constraints: item.constraints.filter(c => c.id !== constraintId)
        }))
      );

      // Publier l'événement de résolution
      await publishEvent('exams', 'constraint_resolved', {
        constraintId,
        resolution,
        timestamp: new Date()
      });

    } catch (error) {
      handleError(error, { context: 'Constraint Resolution' });
    } finally {
      setLoading(false);
    }
  }, [publishEvent, handleError]);

  const getIntegrationStatus = useCallback((examId: string) => {
    return integrationData.find(item => item.examId === examId);
  }, [integrationData]);

  return {
    integrationData,
    loading,
    syncExamWithAcademic,
    resolveConstraint,
    getIntegrationStatus
  };
}
