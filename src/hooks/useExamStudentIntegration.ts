import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useModuleSync } from './module-sync';
import { useErrorHandler } from './useErrorHandler';

export interface StudentEnrollmentRule {
  id: string;
  name: string;
  conditions: {
    programId?: string;
    levelId?: string;
    semester?: number;
    minGrade?: number;
    prerequisites?: string[];
  };
  autoEnroll: boolean;
  requiresApproval: boolean;
}

export interface ExamStudentSync {
  examId: string;
  enrolledStudents: string[];
  eligibleStudents: string[];
  pendingApprovals: string[];
  accommodations: Record<string, any>;
  syncStatus: 'pending' | 'synced' | 'partial' | 'error';
  lastSyncAt?: Date;
}

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

      // Trouver les étudiants éligibles
      const eligibleStudents = await findEligibleStudents(examData);
      
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
      await autoEnrollStudents(examId, examData, eligibleStudents, enrolledStudents);

      // Publier l'événement de synchronisation
      await publishEvent('exams', 'student_sync_completed', {
        examId,
        eligibleCount: eligibleStudents.length,
        enrolledCount: enrolledStudents.length,
        timestamp: new Date()
      });

      // Mettre à jour l'état local
      const syncData: ExamStudentSync = {
        examId,
        enrolledStudents,
        eligibleStudents: eligibleStudents.map(s => s.id),
        pendingApprovals,
        accommodations: extractAccommodations(existingEnrollments),
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

  const findEligibleStudents = async (examData: any) => {
    // Récupérer tous les étudiants du programme
    const { data: students } = await supabase
      .from('students')
      .select(`
        *,
        profiles(*),
        student_progress(*)
      `)
      .eq('program_id', examData.program_id)
      .eq('status', 'active');

    if (!students) return [];

    // Appliquer les règles d'éligibilité
    const eligibleStudents = [];
    
    for (const student of students) {
      const isEligible = await checkStudentEligibility(student, examData);
      if (isEligible) {
        eligibleStudents.push(student);
      }
    }

    return eligibleStudents;
  };

  const checkStudentEligibility = async (student: any, examData: any): Promise<boolean> => {
    // Vérifier le niveau d'études
    if (examData.level_requirement && student.year_level < examData.level_requirement) {
      return false;
    }

    // Vérifier les prérequis de la matière
    const { data: subject } = await supabase
      .from('subjects')
      .select('prerequisites')
      .eq('id', examData.subject_id)
      .single();

    // Vérifier si prerequisites existe et est un tableau
    const prerequisites = subject?.prerequisites;
    if (prerequisites && Array.isArray(prerequisites) && prerequisites.length > 0) {
      const hasPrerequisites = await checkStudentPrerequisites(student.id, prerequisites as string[]);
      if (!hasPrerequisites) return false;
    }

    // Vérifier les notes minimales si requises
    const { data: grades } = await supabase
      .from('student_grades')
      .select('grade, max_grade')
      .eq('student_id', student.id)
      .eq('subject_id', examData.subject_id)
      .eq('academic_year_id', examData.academic_year_id);

    if (grades?.length) {
      const averageGrade = grades.reduce((sum, g) => sum + (g.grade / g.max_grade * 20), 0) / grades.length;
      if (averageGrade < (examData.min_grade_required || 0)) {
        return false;
      }
    }

    return true;
  };

  const checkStudentPrerequisites = async (studentId: string, prerequisites: string[]): Promise<boolean> => {
    for (const prereqId of prerequisites) {
      const { data: grade } = await supabase
        .from('student_grades')
        .select('grade, max_grade')
        .eq('student_id', studentId)
        .eq('subject_id', prereqId)
        .eq('is_published', true)
        .order('evaluation_date', { ascending: false })
        .limit(1)
        .single();

      if (!grade || (grade.grade / grade.max_grade * 20) < 10) {
        return false;
      }
    }
    return true;
  };

  const autoEnrollStudents = async (examId: string, examData: any, eligibleStudents: any[], enrolledStudents: string[]) => {
    const studentsToEnroll = eligibleStudents.filter(s => !enrolledStudents.includes(s.id));
    
    // Appliquer les règles d'inscription automatique
    const autoEnrollRule = enrollmentRules.find(rule => 
      (!rule.conditions.programId || rule.conditions.programId === examData.program_id) &&
      rule.autoEnroll
    );

    if (autoEnrollRule && studentsToEnroll.length > 0) {
      const enrollments = studentsToEnroll.map(student => ({
        exam_id: examId,
        student_id: student.id,
        status: autoEnrollRule.requiresApproval ? 'pending_approval' : 'registered',
        registration_date: new Date().toISOString(),
        special_accommodations: getStudentAccommodations(student)
      }));

      await supabase
        .from('exam_registrations')
        .upsert(enrollments);

      // Publier l'événement d'inscription
      await publishEvent('students', 'auto_enrolled_to_exam', {
        examId,
        studentIds: studentsToEnroll.map(s => s.id),
        timestamp: new Date()
      });
    }
  };

  const getStudentAccommodations = (student: any): any => {
    // Récupérer les accommodations spéciales pour l'étudiant
    // À implémenter selon les besoins (handicap, besoins spéciaux, etc.)
    return {};
  };

  const extractAccommodations = (enrollments: any[]): Record<string, any> => {
    const accommodations: Record<string, any> = {};
    
    enrollments?.forEach(enrollment => {
      if (enrollment.special_accommodations) {
        accommodations[enrollment.student_id] = enrollment.special_accommodations;
      }
    });

    return accommodations;
  };

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
              pendingApprovals: item.pendingApprovals.filter(id => id !== studentId)
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
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setEnrollmentRules(prev => [...prev, newRule]);
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
