
import { supabase } from '@/integrations/supabase/client';
import { StudentEnrollmentRule } from './types';

export const autoEnrollStudents = async (
  examId: string, 
  examData: any, 
  eligibleStudents: any[], 
  enrolledStudents: string[],
  enrollmentRules: StudentEnrollmentRule[],
  publishEvent: (module: string, event: string, data: any) => Promise<void>
) => {
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

export const getStudentAccommodations = (student: any): any => {
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

export const extractAccommodations = (enrollments: any[]): Record<string, any> => {
  const accommodations: Record<string, any> = {};
  
  enrollments?.forEach(enrollment => {
    if (enrollment.special_accommodations) {
      accommodations[enrollment.student_id] = enrollment.special_accommodations;
    }
  });

  return accommodations;
};
