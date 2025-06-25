
import { supabase } from '@/integrations/supabase/client';
import { AcademicConstraint } from './types';

export const validateAcademicConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
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

export const checkTimetableConflicts = async (examData: any): Promise<AcademicConstraint[]> => {
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

export const checkProgramConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
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

export const checkPrerequisites = async (examData: any): Promise<AcademicConstraint[]> => {
  const constraints: AcademicConstraint[] = [];

  // Récupérer les prérequis de la matière
  const { data: subject } = await supabase
    .from('subjects')
    .select('prerequisites')
    .eq('id', examData.subject_id)
    .single();

  // Vérifier si prerequisites existe et est un tableau
  const prerequisites = subject?.prerequisites;
  if (prerequisites && Array.isArray(prerequisites) && prerequisites.length > 0) {
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
