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
    yearLevel?: number;
    maxYearLevel?: number;
  };
  autoEnroll: boolean;
  requiresApproval: boolean;
  priority: number;
}

export interface ExamStudentSync {
  examId: string;
  enrolledStudents: string[];
  eligibleStudents: string[];
  pendingApprovals: string[];
  ineligibleStudents: { studentId: string; reason: string }[];
  accommodations: Record<string, any>;
  enrollmentStats: {
    total: number;
    eligible: number;
    enrolled: number;
    pending: number;
    ineligible: number;
  };
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
      const newEnrollments = await autoEnrollStudents(examId, examData, eligibleStudents, enrolledStudents);

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
  }, [publishEvent, handleError]);

  const findEligibleStudents = async (examData: any) => {
    try {
      // Récupérer tous les étudiants du programme
      const { data: students, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!students_profile_id_fkey(*),
          student_progress(*)
        `)
        .eq('program_id', examData.program_id)
        .eq('status', 'active');

      if (error) throw error;
      if (!students) return { eligibleStudents: [], ineligibleStudents: [] };

      const eligibleStudents = [];
      const ineligibleStudents = [];
      
      for (const student of students) {
        const eligibilityResult = await checkStudentEligibility(student, examData);
        
        if (eligibilityResult.eligible) {
          eligibleStudents.push(student);
        } else {
          ineligibleStudents.push({
            studentId: student.id,
            reason: eligibilityResult.reason || 'Critères d\'éligibilité non remplis'
          });
        }
      }

      return { eligibleStudents, ineligibleStudents };
    } catch (error) {
      console.error('Erreur recherche étudiants éligibles:', error);
      return { eligibleStudents: [], ineligibleStudents: [] };
    }
  };

  const checkStudentEligibility = async (student: any, examData: any): Promise<{ eligible: boolean; reason?: string }> => {
    try {
      // Vérifier le niveau d'études
      if (examData.level_requirement && student.year_level < examData.level_requirement) {
        return { 
          eligible: false, 
          reason: `Niveau d'études insuffisant: ${student.year_level} < ${examData.level_requirement}` 
        };
      }

      // Vérifier les prérequis de la matière
      const { data: subject } = await supabase
        .from('subjects')
        .select('prerequisites')
        .eq('id', examData.subject_id)
        .single();

      const prerequisites = subject?.prerequisites;
      if (prerequisites && Array.isArray(prerequisites) && prerequisites.length > 0) {
        const prerequisiteResult = await checkStudentPrerequisites(student.id, prerequisites as string[]);
        if (!prerequisiteResult.success) {
          return { 
            eligible: false, 
            reason: `Prérequis non validés: ${prerequisiteResult.missingPrerequisites?.join(', ')}` 
          };
        }
      }

      // Vérifier les notes minimales si requises
      if (examData.min_grade_required && examData.min_grade_required > 0) {
        const gradeResult = await checkStudentMinimumGrades(student.id, examData);
        if (!gradeResult.success) {
          return { 
            eligible: false, 
            reason: `Moyenne insuffisante: ${gradeResult.average?.toFixed(2) || 'N/A'} < ${examData.min_grade_required}` 
          };
        }
      }

      // Vérifier l'assiduité si requise
      if (examData.min_attendance_rate && examData.min_attendance_rate > 0) {
        const attendanceResult = await checkStudentAttendance(student.id, examData);
        if (!attendanceResult.success) {
          return { 
            eligible: false, 
            reason: `Assiduité insuffisante: ${attendanceResult.rate?.toFixed(1) || 'N/A'}% < ${examData.min_attendance_rate}%` 
          };
        }
      }

      // Vérifier si l'étudiant n'est pas déjà inscrit
      const { data: existingRegistration } = await supabase
        .from('exam_registrations')
        .select('status')
        .eq('exam_id', examData.id)
        .eq('student_id', student.id)
        .single();

      if (existingRegistration) {
        return { 
          eligible: false, 
          reason: `Déjà inscrit avec le statut: ${existingRegistration.status}` 
        };
      }

      return { eligible: true };
    } catch (error) {
      console.error('Erreur vérification éligibilité étudiant:', error);
      return { eligible: false, reason: 'Erreur de vérification' };
    }
  };

  const checkStudentPrerequisites = async (studentId: string, prerequisites: string[]): Promise<{
    success: boolean;
    missingPrerequisites?: string[];
  }> => {
    try {
      const missingPrerequisites = [];
      
      for (const prereqId of prerequisites) {
        const { data: grade } = await supabase
          .from('student_grades')
          .select(`
            grade, 
            max_grade,
            subjects!student_grades_subject_id_fkey(name)
          `)
          .eq('student_id', studentId)
          .eq('subject_id', prereqId)
          .eq('is_published', true)
          .order('evaluation_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!grade || (grade.grade / grade.max_grade * 20) < 10) {
          missingPrerequisites.push(grade?.subjects?.name || prereqId);
        }
      }
      
      return {
        success: missingPrerequisites.length === 0,
        missingPrerequisites: missingPrerequisites.length > 0 ? missingPrerequisites : undefined
      };
    } catch (error) {
      console.error('Erreur vérification prérequis:', error);
      return { success: false };
    }
  };

  const checkStudentMinimumGrades = async (studentId: string, examData: any): Promise<{
    success: boolean;
    average?: number;
  }> => {
    try {
      const { data: grades } = await supabase
        .from('student_grades')
        .select('grade, max_grade')
        .eq('student_id', studentId)
        .eq('subject_id', examData.subject_id)
        .eq('academic_year_id', examData.academic_year_id)
        .eq('is_published', true);

      if (!grades?.length) {
        return { success: false, average: 0 };
      }

      const average = grades.reduce((sum, g) => sum + (g.grade / g.max_grade * 20), 0) / grades.length;
      
      return {
        success: average >= (examData.min_grade_required || 0),
        average
      };
    } catch (error) {
      console.error('Erreur vérification notes minimales:', error);
      return { success: false };
    }
  };

  const checkStudentAttendance = async (studentId: string, examData: any): Promise<{
    success: boolean;
    rate?: number;
  }> => {
    try {
      const { data: attendance } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('student_id', studentId)
        .eq('subject_id', examData.subject_id)
        .eq('academic_year_id', examData.academic_year_id);

      if (!attendance?.length) {
        return { success: true, rate: 100 }; // Pas d'absences enregistrées
      }

      const totalSessions = attendance.length;
      const presentSessions = attendance.filter(a => a.status === 'present').length;
      const attendanceRate = (presentSessions / totalSessions) * 100;

      return {
        success: attendanceRate >= (examData.min_attendance_rate || 0),
        rate: attendanceRate
      };
    } catch (error) {
      console.error('Erreur vérification assiduité:', error);
      return { success: true }; // En cas d'erreur, ne pas bloquer
    }
  };

  const autoEnrollStudents = async (examId: string, examData: any, eligibleStudents: any[], enrolledStudents: string[]) => {
    try {
      const studentsToEnroll = eligibleStudents.filter(s => !enrolledStudents.includes(s.id));
      
      if (studentsToEnroll.length === 0) {
        return [];
      }

      // Trouver la règle d'inscription automatique applicable
      const applicableRule = enrollmentRules
        .filter(rule => rule.autoEnroll)
        .find(rule => 
          (!rule.conditions.programId || rule.conditions.programId === examData.program_id) &&
          (!rule.conditions.semester || rule.conditions.semester === examData.semester)
        );

      if (!applicableRule) {
        console.log('Aucune règle d\'inscription automatique applicable');
        return [];
      }

      const enrollments = studentsToEnroll.map(student => ({
        exam_id: examId,
        student_id: student.id,
        status: applicableRule.requiresApproval ? 'pending_approval' : 'registered',
        registration_date: new Date().toISOString(),
        special_accommodations: getStudentAccommodations(student)
      }));

      const { data: newEnrollments, error } = await supabase
        .from('exam_registrations')
        .insert(enrollments)
        .select('student_id');

      if (error) {
        console.error('Erreur inscription automatique:', error);
        return [];
      }

      // Publier l'événement d'inscription
      await publishEvent('students', 'auto_enrolled_to_exam', {
        examId,
        studentIds: studentsToEnroll.map(s => s.id),
        ruleId: applicableRule.id,
        timestamp: new Date()
      });

      return newEnrollments?.map(e => e.student_id) || [];
    } catch (error) {
      console.error('Erreur inscription automatique:', error);
      return [];
    }
  };

  const getStudentAccommodations = (student: any): any => {
    // Récupérer les accommodations spéciales pour l'étudiant
    const accommodations: any = {};
    
    // Vérifier les besoins spéciaux dans le profil
    if (student.profiles?.special_needs) {
      accommodations.special_needs = student.profiles.special_needs;
    }
    
    // Ajouter du temps supplémentaire si nécessaire
    if (student.profiles?.requires_extra_time) {
      accommodations.extra_time_percentage = 50; // 50% de temps en plus
    }
    
    // Salle spéciale si nécessaire
    if (student.profiles?.requires_special_room) {
      accommodations.special_room_required = true;
    }

    return Object.keys(accommodations).length > 0 ? accommodations : null;
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
