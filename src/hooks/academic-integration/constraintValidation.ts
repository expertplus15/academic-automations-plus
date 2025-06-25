
import { supabase } from '@/integrations/supabase/client';
import { AcademicConstraint } from './types';

export const validateAcademicConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
  const constraints: AcademicConstraint[] = [];

  try {
    // Vérifier les conflits d'emploi du temps
    const timeConflicts = await checkTimetableConflicts(examData);
    constraints.push(...timeConflicts);

    // Vérifier la cohérence avec le programme académique
    const programConstraints = await checkProgramConstraints(examData);
    constraints.push(...programConstraints);

    // Vérifier les prérequis de la matière
    const prerequisiteConstraints = await checkPrerequisites(examData);
    constraints.push(...prerequisiteConstraints);

    // Vérifier les contraintes de capacité
    const capacityConstraints = await checkCapacityConstraints(examData);
    constraints.push(...capacityConstraints);

    // Vérifier les contraintes de type d'examen
    const examTypeConstraints = await checkExamTypeConstraints(examData);
    constraints.push(...examTypeConstraints);

    // Vérifier les créneaux horaires autorisés
    const timeSlotConstraints = await checkTimeSlotConstraints(examData);
    constraints.push(...timeSlotConstraints);

  } catch (error) {
    console.error('Erreur lors de la validation des contraintes académiques:', error);
    constraints.push({
      id: `validation_error_${examData.id}`,
      type: 'resource_conflict',
      severity: 'high',
      description: 'Erreur lors de la validation des contraintes académiques',
      affectedEntities: [examData.id]
    });
  }

  return constraints;
};

export const checkTimetableConflicts = async (examData: any): Promise<AcademicConstraint[]> => {
  const conflicts: AcademicConstraint[] = [];
  
  if (!examData.exam_sessions?.length) return conflicts;

  try {
    for (const session of examData.exam_sessions) {
      // Vérifier les conflits avec l'emploi du temps existant
      const { data: conflictingSlots } = await supabase
        .from('timetables')
        .select(`
          *,
          subjects(name),
          rooms(name)
        `)
        .eq('academic_year_id', examData.academic_year_id)
        .eq('room_id', session.room_id)
        .eq('day_of_week', new Date(session.start_time).getDay())
        .or(`and(start_time.lte.${new Date(session.start_time).toTimeString().slice(0, 5)},end_time.gt.${new Date(session.start_time).toTimeString().slice(0, 5)}),and(start_time.lt.${new Date(session.end_time).toTimeString().slice(0, 5)},end_time.gte.${new Date(session.end_time).toTimeString().slice(0, 5)})`);

      if (conflictingSlots?.length) {
        conflicts.push({
          id: `time_conflict_${session.id}`,
          type: 'time_conflict',
          severity: 'high',
          description: `Conflit d'horaire détecté pour la session ${session.id}`,
          affectedEntities: [session.id, ...conflictingSlots.map(slot => slot.id)],
          suggestedResolution: 'Modifier l\'horaire de la session d\'examen ou déplacer les cours conflictuels'
        });
      }

      // Vérifier les conflits avec d'autres examens
      const { data: examConflicts } = await supabase
        .from('exam_sessions')
        .select(`
          *,
          exams(title, subject_id)
        `)
        .neq('id', session.id)
        .eq('room_id', session.room_id)
        .eq('status', 'scheduled')
        .or(`and(start_time.lte.${session.start_time},end_time.gt.${session.start_time}),and(start_time.lt.${session.end_time},end_time.gte.${session.end_time})`);

      if (examConflicts?.length) {
        conflicts.push({
          id: `exam_conflict_${session.id}`,
          type: 'time_conflict',
          severity: 'critical',
          description: `Conflit avec d'autres examens pour la session ${session.id}`,
          affectedEntities: [session.id, ...examConflicts.map(exam => exam.id)],
          suggestedResolution: 'Reprogrammer l\'un des examens en conflit'
        });
      }
    }
  } catch (error) {
    console.error('Erreur vérification conflits horaires:', error);
  }

  return conflicts;
};

export const checkProgramConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
  const constraints: AcademicConstraint[] = [];

  try {
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
        affectedEntities: [examData.id, examData.program_id, examData.subject_id],
        suggestedResolution: 'Vérifier la cohérence entre la matière et le programme'
      });
    }

    // Vérifier la cohérence du semestre
    if (programSubject && examData.semester && programSubject.semester !== examData.semester) {
      constraints.push({
        id: `semester_constraint_${examData.id}`,
        type: 'resource_conflict',
        severity: 'medium',
        description: `Incohérence de semestre: examen au semestre ${examData.semester}, matière au semestre ${programSubject.semester}`,
        affectedEntities: [examData.id],
        suggestedResolution: 'Corriger le semestre de l\'examen'
      });
    }
  } catch (error) {
    console.error('Erreur vérification contraintes programme:', error);
  }

  return constraints;
};

export const checkPrerequisites = async (examData: any): Promise<AcademicConstraint[]> => {
  const constraints: AcademicConstraint[] = [];

  try {
    // Récupérer les prérequis de la matière
    const { data: subject } = await supabase
      .from('subjects')
      .select('prerequisites')
      .eq('id', examData.subject_id)
      .single();

    const prerequisites = subject?.prerequisites;
    if (prerequisites && Array.isArray(prerequisites) && prerequisites.length > 0) {
      // Vérifier que les étudiants inscrits ont validé les prérequis
      const { data: registrations } = await supabase
        .from('exam_registrations')
        .select('student_id')
        .eq('exam_id', examData.id)
        .eq('status', 'registered');

      if (registrations?.length) {
        const studentsWithoutPrerequisites = [];
        
        for (const registration of registrations) {
          const hasPrerequisites = await checkStudentPrerequisites(registration.student_id, prerequisites as string[]);
          if (!hasPrerequisites) {
            studentsWithoutPrerequisites.push(registration.student_id);
          }
        }

        if (studentsWithoutPrerequisites.length > 0) {
          constraints.push({
            id: `prerequisites_${examData.id}`,
            type: 'student_overlap',
            severity: studentsWithoutPrerequisites.length > registrations.length / 2 ? 'high' : 'medium',
            description: `${studentsWithoutPrerequisites.length} étudiant(s) n'ont pas validé les prérequis`,
            affectedEntities: [examData.id, ...studentsWithoutPrerequisites],
            suggestedResolution: 'Vérifier l\'éligibilité et désinscrire les étudiants non éligibles'
          });
        }
      }
    }
  } catch (error) {
    console.error('Erreur vérification prérequis:', error);
  }

  return constraints;
};

export const checkCapacityConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
  const constraints: AcademicConstraint[] = [];

  try {
    for (const session of examData.exam_sessions || []) {
      if (session.room_id) {
        const { data: room } = await supabase
          .from('rooms')
          .select('capacity, name')
          .eq('id', session.room_id)
          .single();

        const { data: registrations } = await supabase
          .from('exam_registrations')
          .select('id')
          .eq('session_id', session.id)
          .eq('status', 'registered');

        const registeredCount = registrations?.length || 0;
        const roomCapacity = room?.capacity || 0;

        if (registeredCount > roomCapacity) {
          constraints.push({
            id: `capacity_constraint_${session.id}`,
            type: 'resource_conflict',
            severity: 'critical',
            description: `Capacité insuffisante: ${registeredCount} étudiants pour ${roomCapacity} places dans ${room?.name}`,
            affectedEntities: [session.id, session.room_id],
            suggestedResolution: 'Changer de salle ou créer une session supplémentaire'
          });
        } else if (registeredCount > roomCapacity * 0.9) {
          constraints.push({
            id: `capacity_warning_${session.id}`,
            type: 'resource_conflict',
            severity: 'medium',
            description: `Capacité presque atteinte: ${registeredCount} étudiants pour ${roomCapacity} places`,
            affectedEntities: [session.id],
            suggestedResolution: 'Prévoir une salle de plus grande capacité'
          });
        }
      }
    }
  } catch (error) {
    console.error('Erreur vérification capacité:', error);
  }

  return constraints;
};

export const checkExamTypeConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
  const constraints: AcademicConstraint[] = [];

  try {
    for (const session of examData.exam_sessions || []) {
      if (session.room_id) {
        const { data: room } = await supabase
          .from('rooms')
          .select('room_type, equipment, name')
          .eq('id', session.room_id)
          .single();

        // Vérifier la compatibilité type d'examen / type de salle
        const requiredRoomType = getRequiredRoomTypeForExam(examData.exam_type);
        if (room && !isRoomTypeCompatible(room.room_type, requiredRoomType)) {
          constraints.push({
            id: `room_type_constraint_${session.id}`,
            type: 'resource_conflict',
            severity: 'high',
            description: `Type de salle incompatible: examen ${examData.exam_type} dans salle ${room.room_type}`,
            affectedEntities: [session.id],
            suggestedResolution: `Utiliser une salle de type ${requiredRoomType}`
          });
        }

        // Vérifier les équipements requis
        const requiredEquipment = getRequiredEquipmentForExam(examData.exam_type);
        if (room && requiredEquipment.length > 0) {
          const roomEquipment = room.equipment || [];
          const missingEquipment = requiredEquipment.filter(req => 
            !roomEquipment.some((eq: any) => eq.type === req)
          );

          if (missingEquipment.length > 0) {
            constraints.push({
              id: `equipment_constraint_${session.id}`,
              type: 'resource_conflict',
              severity: 'medium',
              description: `Équipements manquants: ${missingEquipment.join(', ')}`,
              affectedEntities: [session.id],
              suggestedResolution: 'Réserver les équipements manquants ou changer de salle'
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Erreur vérification type examen:', error);
  }

  return constraints;
};

export const checkTimeSlotConstraints = async (examData: any): Promise<AcademicConstraint[]> => {
  const constraints: AcademicConstraint[] = [];

  try {
    for (const session of examData.exam_sessions || []) {
      const sessionDate = new Date(session.start_time);
      const dayOfWeek = sessionDate.getDay();
      const startHour = sessionDate.getHours();
      const endHour = new Date(session.end_time).getHours();

      // Vérifier les créneaux autorisés (pas le weekend)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        constraints.push({
          id: `weekend_constraint_${session.id}`,
          type: 'time_conflict',
          severity: 'high',
          description: 'Examen programmé le weekend',
          affectedEntities: [session.id],
          suggestedResolution: 'Reprogrammer en semaine'
        });
      }

      // Vérifier les heures autorisées (8h-18h)
      if (startHour < 8 || endHour > 18) {
        constraints.push({
          id: `hours_constraint_${session.id}`,
          type: 'time_conflict',
          severity: 'medium',
          description: 'Examen en dehors des heures autorisées (8h-18h)',
          affectedEntities: [session.id],
          suggestedResolution: 'Reprogrammer entre 8h et 18h'
        });
      }

      // Vérifier la durée maximale
      const durationHours = (endHour - startHour);
      if (durationHours > 4) {
        constraints.push({
          id: `duration_constraint_${session.id}`,
          type: 'time_conflict',
          severity: 'medium',
          description: `Durée excessive: ${durationHours}h (max recommandé: 4h)`,
          affectedEntities: [session.id],
          suggestedResolution: 'Réduire la durée ou diviser en plusieurs sessions'
        });
      }
    }
  } catch (error) {
    console.error('Erreur vérification créneaux horaires:', error);
  }

  return constraints;
};

const checkStudentPrerequisites = async (studentId: string, prerequisites: string[]): Promise<boolean> => {
  try {
    for (const prereqId of prerequisites) {
      const { data: grade } = await supabase
        .from('student_grades')
        .select('grade, max_grade')
        .eq('student_id', studentId)
        .eq('subject_id', prereqId)
        .eq('is_published', true)
        .order('evaluation_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!grade || (grade.grade / grade.max_grade * 20) < 10) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Erreur vérification prérequis étudiant:', error);
    return false;
  }
};

const getRequiredRoomTypeForExam = (examType: string): string => {
  switch (examType) {
    case 'practical': return 'laboratory';
    case 'oral': return 'meeting_room';
    case 'computer': return 'computer_lab';
    default: return 'classroom';
  }
};

const isRoomTypeCompatible = (roomType: string, requiredType: string): boolean => {
  // Amphitheater peut accueillir tous types d'examens écrits
  if (roomType === 'amphitheater' && requiredType === 'classroom') return true;
  
  // Computer lab peut accueillir les examens écrits
  if (roomType === 'computer_lab' && requiredType === 'classroom') return true;
  
  return roomType === requiredType;
};

const getRequiredEquipmentForExam = (examType: string): string[] => {
  switch (examType) {
    case 'computer': return ['computers', 'projector'];
    case 'practical': return ['laboratory_equipment'];
    case 'oral': return ['microphone', 'recording_equipment'];
    default: return [];
  }
};
