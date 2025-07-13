import { useState, useEffect, useCallback } from 'react';
import { useModuleSync } from '../module-sync';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface AcademicStudentSyncData {
  studentId: string;
  programId: string;
  academicYearId: string;
  enrollments: StudentEnrollment[];
  academicProgress: AcademicProgress;
  synchronizedAt: Date;
  syncStatus: 'pending' | 'synced' | 'conflict' | 'error';
}

export interface StudentEnrollment {
  studentId: string;
  subjectId: string;
  classGroupId?: string;
  enrollmentDate: Date;
  status: 'active' | 'withdrawn' | 'completed';
  gradeData?: GradeData[];
}

export interface AcademicProgress {
  studentId: string;
  overallAverage?: number;
  attendanceRate?: number;
  creditsEarned: number;
  creditsRequired: number;
  semester: number;
  academicStanding: 'good' | 'warning' | 'probation' | 'suspension';
}

export interface GradeData {
  subjectId: string;
  evaluationType: string;
  grade: number;
  maxGrade: number;
  weight: number;
  date: Date;
}

export function useAcademicStudentSync() {
  const [syncData, setSyncData] = useState<AcademicStudentSyncData[]>([]);
  const [loading, setLoading] = useState(false);
  const { publishEvent } = useModuleSync();
  const { handleError } = useErrorHandler();

  // Synchroniser un étudiant avec ses données académiques
  const syncStudentWithAcademic = useCallback(async (studentId: string) => {
    try {
      setLoading(true);

      // 1. Récupérer les données étudiant
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      // 2. Récupérer les inscriptions aux matières
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('program_subjects')
        .select(`
          subject_id,
          subjects!inner(*),
          is_mandatory
        `)
        .eq('program_id', student.program_id);

      if (enrollmentsError) throw enrollmentsError;

      // 3. Récupérer les notes existantes (utiliser academic_year actuelle)
      const { data: academicYear } = await supabase
        .from('academic_years')
        .select('id')
        .eq('is_current', true)
        .single();

      const { data: grades, error: gradesError } = await supabase
        .from('student_grades')
        .select(`
          *,
          subjects!inner(*),
          evaluation_types!inner(*)
        `)
        .eq('student_id', studentId)
        .eq('academic_year_id', academicYear?.id || '');

      if (gradesError) console.warn('Grades fetch error:', gradesError);

      

      // 4. Calculer la progression académique
      const creditsEarned = grades
        ?.filter(g => g.grade >= 10)
        .reduce((sum, g) => sum + (g.subjects?.credits_ects || 0), 0) || 0;

      const creditsRequired = enrollments
        ?.reduce((sum, e) => sum + (e.subjects?.credits_ects || 0), 0) || 0;

      const overallAverage = grades?.length > 0
        ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
        : undefined;

      // 5. Déterminer le statut académique
      let academicStanding: AcademicProgress['academicStanding'] = 'good';
      if (overallAverage && overallAverage < 8) academicStanding = 'suspension';
      else if (overallAverage && overallAverage < 10) academicStanding = 'probation';
      else if (overallAverage && overallAverage < 12) academicStanding = 'warning';

      // 6. Créer l'objet de synchronisation
      const academicProgress: AcademicProgress = {
        studentId,
        overallAverage,
        creditsEarned,
        creditsRequired,
        semester: 1, // À déterminer selon la logique métier
        academicStanding
      };

      const studentEnrollments: StudentEnrollment[] = enrollments?.map(e => ({
        studentId,
        subjectId: e.subject_id,
        enrollmentDate: new Date(student.enrollment_date || new Date()),
        status: 'active' as const,
        gradeData: grades
          ?.filter(g => g.subject_id === e.subject_id)
          .map(g => ({
            subjectId: g.subject_id,
            evaluationType: g.evaluation_types?.name || 'Examen',
            grade: g.grade,
            maxGrade: g.max_grade,
            weight: g.evaluation_types?.weight_percentage || 100,
            date: new Date(g.evaluation_date || g.created_at)
          }))
      })) || [];

      const syncResult: AcademicStudentSyncData = {
        studentId,
        programId: student.program_id,
        academicYearId: academicYear?.id || '',
        enrollments: studentEnrollments,
        academicProgress,
        synchronizedAt: new Date(),
        syncStatus: 'synced'
      };

      // 7. Mettre à jour l'état local
      setSyncData(prev => {
        const existing = prev.findIndex(s => s.studentId === studentId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = syncResult;
          return updated;
        }
        return [syncResult, ...prev];
      });

      // 8. Publier l'événement de synchronisation
      await publishEvent('students', 'academic_sync_completed', {
        studentId,
        syncData: syncResult,
        timestamp: new Date().toISOString()
      });

      return { success: true, syncData: syncResult };

    } catch (error) {
      handleError(error, { context: 'Synchronisation académique' });
      
      // Marquer comme erreur
      setSyncData(prev => {
        const existing = prev.findIndex(s => s.studentId === studentId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], syncStatus: 'error' };
          return updated;
        }
        return prev;
      });

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [publishEvent, handleError]);

  // Synchroniser tous les étudiants d'un programme
  const syncProgramStudents = useCallback(async (programId: string, academicYearId: string) => {
    try {
      setLoading(true);

      const { data: students, error } = await supabase
        .from('students')
        .select('id')
        .eq('program_id', programId)
        .eq('status', 'active');

      if (error) throw error;

      const results = await Promise.allSettled(
        students?.map(s => syncStudentWithAcademic(s.id)) || []
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      await publishEvent('academic', 'program_sync_completed', {
        programId,
        academicYearId,
        totalStudents: students?.length || 0,
        successful,
        failed,
        timestamp: new Date().toISOString()
      });

      return { success: true, summary: { total: students?.length || 0, successful, failed } };

    } catch (error) {
      handleError(error, { context: 'Synchronisation programme' });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [syncStudentWithAcademic, publishEvent, handleError]);

  // Détecter les conflits de synchronisation
  const detectSyncConflicts = useCallback(async (studentId: string) => {
    try {
      const studentSync = syncData.find(s => s.studentId === studentId);
      if (!studentSync) return { conflicts: [] };

      const conflicts = [];

      // Vérifier les incohérences entre les données
      if (studentSync.academicProgress.creditsEarned > studentSync.academicProgress.creditsRequired) {
        conflicts.push({
          type: 'credits_mismatch',
          severity: 'high',
          description: 'Crédits obtenus supérieurs aux crédits requis',
          suggestion: 'Vérifier le calcul des crédits ECTS'
        });
      }

      // Vérifier les notes sans inscription
      for (const enrollment of studentSync.enrollments) {
        if (enrollment.gradeData && enrollment.gradeData.length > 0 && enrollment.status !== 'active') {
          conflicts.push({
            type: 'grades_without_enrollment',
            severity: 'medium',
            description: `Notes présentes pour ${enrollment.subjectId} sans inscription active`,
            suggestion: 'Mettre à jour le statut d\'inscription ou supprimer les notes'
          });
        }
      }

      return { conflicts };

    } catch (error) {
      handleError(error, { context: 'Détection conflits' });
      return { conflicts: [] };
    }
  }, [syncData, handleError]);

  // Obtenir le statut de synchronisation d'un étudiant
  const getSyncStatus = useCallback((studentId: string) => {
    return syncData.find(s => s.studentId === studentId);
  }, [syncData]);

  // Auto-synchronisation lors des changements
  useEffect(() => {
    // Écouter les changements dans les notes
    const gradesChannel = supabase
      .channel('grades-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_grades'
      }, async (payload) => {
        if (payload.new && 'student_id' in payload.new) {
          await syncStudentWithAcademic(payload.new.student_id as string);
        }
      })
      .subscribe();

    // Écouter les changements dans les inscriptions
    const enrollmentsChannel = supabase
      .channel('enrollments-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'enrollments'
      }, async (payload) => {
        if (payload.new && 'student_id' in payload.new) {
          await syncStudentWithAcademic(payload.new.student_id as string);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(gradesChannel);
      supabase.removeChannel(enrollmentsChannel);
    };
  }, [syncStudentWithAcademic]);

  return {
    syncData,
    loading,
    syncStudentWithAcademic,
    syncProgramStudents,
    detectSyncConflicts,
    getSyncStatus
  };
}