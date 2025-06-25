
import { supabase } from '@/integrations/supabase/client';
import { EligibilityResult, PrerequisiteResult, GradeResult, AttendanceResult } from './types';

export const checkStudentEligibility = async (student: any, examData: any): Promise<EligibilityResult> => {
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

export const checkStudentPrerequisites = async (studentId: string, prerequisites: string[]): Promise<PrerequisiteResult> => {
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

export const checkStudentMinimumGrades = async (studentId: string, examData: any): Promise<GradeResult> => {
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

export const checkStudentAttendance = async (studentId: string, examData: any): Promise<AttendanceResult> => {
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

export const findEligibleStudents = async (examData: any) => {
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
