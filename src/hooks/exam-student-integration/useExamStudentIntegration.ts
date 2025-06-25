
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from '../module-sync';
import { useErrorHandler } from '../useErrorHandler';
import { 
  StudentEnrollmentRule, 
  ExamStudentSync 
} from './types';
import { findEligibleStudents } from './studentEligibility';
import { autoEnrollStudents, extractAccommodations } from './studentEnrollment';

export function useExamStudentIntegration() {
  const [integrationData, setIntegrationData] = useState<ExamStudentSync[]>([]);
  const [enrollmentRules, setEnrollmentRules] = useState<StudentEnrollmentRule[]>([]);
  const [loading, setLoading] = useState(false);
  const { publishEvent } = useModuleSync();
  const { handleError } = useErrorHandler();

  const syncExamWithStudents = useCallback(async (examId: string) => {
    try {
      setLoading(true);

      // Récupérer les données de l'examen
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select(`
          *,
          subjects(*),
          programs(*)
        `)
        .eq('id', examId)
        .single();

      if (examError) throw examError;

      // Trouver les étudiants éligibles et inéligibles
      const { eligibleStudents, ineligibleStudents } = await findEligibleStudents(examData);
      
      // Récupérer les inscriptions existantes
      const { data: existingEnrollments } = await supabase
        .from('exam_registrations')
        .select('student_id, status, special_accommodations')
        .eq('exam_id', examId);

      const enrolledStudents = existingEnrollments
        ?.filter(e => e.status === 'registered')
        ?.map(e => e.student_id) || [];

      const pendingApprovals = existingEnrollments
        ?.filter(e => e.status === 'pending_approval')
        ?.map(e => e.student_id) || [];

      // Inscription automatique selon les règles
      const newEnrollments = await autoEnrollStudents(
        examId, 
        examData, 
        eligibleStudents, 
        enrolledStudents,
        enrollmentRules,
        publishEvent
      );

      // Calculer les statistiques
      const enrollmentStats = {
        total: eligibleStudents.length + ineligibleStudents.length,
        eligible: eligibleStudents.length,
        enrolled: enrolledStudents.length + newEnrollments.length,
        pending: pendingApprovals.length,
        ineligible: ineligibleStudents.length
      };

      // Publier l'événement de synchronisation
      await publishEvent('exams', 'student_sync_completed', {
        examId,
        stats: enrollmentStats,
        timestamp: new Date()
      });

      // Mettre à jour l'état local
      const syncData: ExamStudentSync = {
        examId,
        enrolledStudents: [...enrolledStudents, ...newEnrollments],
        eligibleStudents: eligibleStudents.map(s => s.id),
        pendingApprovals,
        ineligibleStudents,
        accommodations: extractAccommodations(existingEnrollments),
        enrollmentStats,
        syncStatus: 'synced',
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
      handleError(error, { context: 'Exam Student Integration' });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [publishEvent, handleError, enrollmentRules]);

  const approveStudentEnrollment = useCallback(async (examId: string, studentId: string) => {
    try {
      await supabase
        .from('exam_registrations')
        .update({ status: 'registered' })
        .eq('exam_id', examId)
        .eq('student_id', studentId);

      // Mettre à jour l'état local
      setIntegrationData(prev => 
        prev.map(item => {
          if (item.examId === examId) {
            return {
              ...item,
              enrolledStudents: [...item.enrolledStudents, studentId],
              pendingApprovals: item.pendingApprovals.filter(id => id !== studentId),
              enrollmentStats: {
                ...item.enrollmentStats,
                enrolled: item.enrollmentStats.enrolled + 1,
                pending: item.enrollmentStats.pending - 1
              }
            };
          }
          return item;
        })
      );

      await publishEvent('exams', 'student_enrollment_approved', {
        examId,
        studentId,
        timestamp: new Date()
      });

    } catch (error) {
      handleError(error, { context: 'Student Enrollment Approval' });
    }
  }, [publishEvent, handleError]);

  const addEnrollmentRule = useCallback((rule: Omit<StudentEnrollmentRule, 'id'>) => {
    const newRule: StudentEnrollmentRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      priority: rule.priority || 1
    };
    
    setEnrollmentRules(prev => [...prev, newRule].sort((a, b) => b.priority - a.priority));
  }, []);

  const getIntegrationStatus = useCallback((examId: string) => {
    return integrationData.find(item => item.examId === examId);
  }, [integrationData]);

  return {
    integrationData,
    enrollmentRules,
    loading,
    syncExamWithStudents,
    approveStudentEnrollment,
    addEnrollmentRule,
    getIntegrationStatus
  };
}
