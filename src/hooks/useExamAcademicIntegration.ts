
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from './useModuleSync';
import { useErrorHandler } from './useErrorHandler';
import { useExams } from './useExams';

export interface AcademicConstraint {
  id: string;
  type: 'time_conflict' | 'resource_conflict' | 'teacher_availability' | 'student_overlap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedEntities: string[];
  suggestedResolution?: string;
}

export interface ExamAcademicSync {
  examId: string;
  subjectId: string;
  programId: string;
  academicYearId: string;
  constraints: AcademicConstraint[];
  syncStatus: 'pending' | 'synced' | 'conflict' | 'error';
  lastSyncAt?: Date;
}

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
      const constraints = await validateAcademicConstraints(examData);
      
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

  const validateAcademicConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
    const constraints: AcademicConstraint[] = [];

    // Vérifier les conflits d'emploi du temps
    const timeConflicts = await checkTimetableConflicts(examData);
    constraints.push(...timeConflicts);

    // Vérifier la cohérence avec le programme académique
    const programConstraints = await checkProgramConstraints(examData);
    constraints.push(...programConstraints);

    // Vérifier les prérequis de la matière
    const prerequisiteConstraints = await checkPrerequisites(examData);
    constraints.push(...prerequisiteConstraints);

    return constraints;
  };

  const checkTimetableConflicts = async (examData: any): Promise<AcademicConstraint[]> => {
    const conflicts: AcademicConstraint[] = [];
    
    if (!examData.exam_sessions?.length) return conflicts;

    for (const session of examData.exam_sessions) {
      // Vérifier les conflits avec l'emploi du temps existant
      const { data: conflictingSlots } = await supabase
        .from('timetables')
        .select('*')
        .eq('academic_year_id', examData.academic_year_id)
        .eq('room_id', session.room_id)
        .gte('start_time', session.start_time)
        .lte('end_time', session.end_time);

      if (conflictingSlots?.length) {
        conflicts.push({
          id: `time_conflict_${session.id}`,
          type: 'time_conflict',
          severity: 'high',
          description: `Conflit d'horaire détecté pour la session ${session.id}`,
          affectedEntities: [session.id, ...conflictingSlots.map(slot => slot.id)],
          suggestedResolution: 'Modifier l\'horaire de la session d\'examen'
        });
      }
    }

    return conflicts;
  };

  const checkProgramConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
    const constraints: AcademicConstraint[] = [];

    // Vérifier que la matière appartient bien au programme
    const { data: programSubject } = await supabase
      .from('program_subjects')
      .select('*')
      .eq('program_id', examData.program_id)
      .eq('subject_id', examData.subject_id)
      .single();

    if (!programSubject) {
      constraints.push({
        id: `program_constraint_${examData.id}`,
        type: 'resource_conflict',
        severity: 'critical',
        description: 'La matière ne fait pas partie du programme spécifié',
        affectedEntities: [examData.id, examData.program_id, examData.subject_id]
      });
    }

    return constraints;
  };

  const checkPrerequisites = async (examData: any): Promise<AcademicConstraint[]> => {
    const constraints: AcademicConstraint[] = [];

    // Récupérer les prérequis de la matière
    const { data: subject } = await supabase
      .from('subjects')
      .select('prerequisites')
      .eq('id', examData.subject_id)
      .single();

    if (subject?.prerequisites?.length) {
      // Vérifier que les étudiants inscrits ont validé les prérequis
      // Cette logique peut être étendue selon les besoins
      constraints.push({
        id: `prerequisites_${examData.id}`,
        type: 'student_overlap',
        severity: 'medium',
        description: 'Vérification des prérequis requise pour certains étudiants',
        affectedEntities: [examData.id],
        suggestedResolution: 'Vérifier l\'éligibilité des étudiants inscrits'
      });
    }

    return constraints;
  };

  const syncWithTimetable = async (examData: any) => {
    // Synchroniser les sessions d'examen avec l'emploi du temps
    for (const session of examData.exam_sessions || []) {
      // Créer ou mettre à jour les créneaux dans l'emploi du temps
      await supabase
        .from('timetables')
        .upsert({
          subject_id: examData.subject_id,
          program_id: examData.program_id,
          academic_year_id: examData.academic_year_id,
          room_id: session.room_id,
          start_time: new Date(session.start_time).toTimeString().slice(0, 5),
          end_time: new Date(session.end_time).toTimeString().slice(0, 5),
          day_of_week: new Date(session.start_time).getDay(),
          slot_type: 'exam',
          status: 'scheduled'
        });
    }
  };

  const checkTeacherAvailability = async (examData: any) => {
    // Vérifier la disponibilité des enseignants pour la surveillance
    const { data: supervisors } = await supabase
      .from('exam_supervisors')
      .select(`
        *,
        teacher_availability(*)
      `)
      .in('session_id', examData.exam_sessions?.map((s: any) => s.id) || []);

    // Logique de vérification de disponibilité
    // À implémenter selon les règles métier
  };

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
