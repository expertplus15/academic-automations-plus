
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from '../module-sync';
import { useErrorHandler } from '../useErrorHandler';
import { ExamStudentSync, StudentEnrollmentRule } from './types';
import { checkStudentEligibility, getEligibleStudents } from './studentEligibility';
import { autoEnrollStudents, extractAccommodations } from './studentEnrollment';

export function useExamStudentIntegration() {
  const [integrationData, setIntegrationData] = useState<ExamStudentSync[]>([]);
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

      // Récupérer les étudiants déjà inscrits
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('exam_registrations')
        .select('student_id, special_accommodations, status')
        .eq('exam_id', examId);

      if (enrollmentError) throw enrollmentError;

      const enrolledStudents = enrollments?.filter(e => e.status === 'registered').map(e => e.student_id) || [];
      const pendingApprovals = enrollments?.filter(e => e.status === 'pending_approval').map(e => e.student_id) || [];

      // Obtenir les étudiants éligibles
      const { eligibleStudents, ineligibleStudents } = await getEligibleStudents(examData);

      // Règles d'inscription automatique (simulées)
      const enrollmentRules: StudentEnrollmentRule[] = [
        {
          id: '1',
          name: 'Inscription automatique programme',
          conditions: {
            programId: examData.program_id,
            semester: 1,
            minGrade: 10
          },
          autoEnroll: true,
          requiresApproval: false,
          priority: 1
        }
      ];

      // Inscription automatique
      const autoEnrolledStudents = await autoEnrollStudents(
        examId,
        examData,
        eligibleStudents,
        enrolledStudents,
        enrollmentRules,
        async (module: string, event: string, data: any) => {
          await publishEvent(module, event, data);
        }
      );

      // Extraire les accommodations
      const accommodations = extractAccommodations(enrollments || []);

      // Calculer les statistiques
      const enrollmentStats = {
        total: eligibleStudents.length + ineligibleStudents.length,
        eligible: eligibleStudents.length,
        enrolled: enrolledStudents.length + autoEnrolledStudents.length,
        pending: pendingApprovals.length,
        ineligible: ineligibleStudents.length
      };

      // Publier l'événement de synchronisation
      await publishEvent('students', 'exam_sync_completed', {
        examId,
        enrollmentStats,
        timestamp: new Date()
      });

      // Mettre à jour l'état local
      const syncData: ExamStudentSync = {
        examId,
        enrolledStudents: [...enrolledStudents, ...autoEnrolledStudents],
        eligibleStudents: eligibleStudents.map(s => s.id),
        pendingApprovals,
        ineligibleStudents,
        accommodations,
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
  }, [publishEvent, handleError]);

  const enrollStudent = useCallback(async (examId: string, studentId: string, accommodations?: any) => {
    try {
      setLoading(true);

      // Vérifier l'éligibilité de l'étudiant
      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single();

      if (!examData) throw new Error('Examen non trouvé');

      const { data: studentData } = await supabase
        .from('students')
        .select('*, profiles(*)')
        .eq('id', studentId)
        .single();

      if (!studentData) throw new Error('Étudiant non trouvé');

      const eligibilityResult = await checkStudentEligibility(studentData, examData);
      
      if (!eligibilityResult.eligible) {
        throw new Error(`Étudiant non éligible: ${eligibilityResult.reason}`);
      }

      // Inscrire l'étudiant
      const { error } = await supabase
        .from('exam_registrations')
        .insert({
          exam_id: examId,
          student_id: studentId,
          status: 'registered',
          special_accommodations: accommodations || null
        });

      if (error) throw error;

      // Re-synchroniser après inscription
      await syncExamWithStudents(examId);

      return { success: true };
    } catch (error) {
      handleError(error, { context: 'Student Enrollment' });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [syncExamWithStudents, handleError]);

  const getIntegrationStatus = useCallback((examId: string) => {
    return integrationData.find(item => item.examId === examId);
  }, [integrationData]);

  return {
    integrationData,
    loading,
    syncExamWithStudents,
    enrollStudent,
    getIntegrationStatus
  };
}
