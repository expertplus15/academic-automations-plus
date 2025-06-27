import { supabase } from '@/integrations/supabase/client';

export const syncWithTimetable = async (examData: any): Promise<any> => {
  try {
    console.log('Synchronisation des emplois du temps avec l\'examen:', examData.id);

    // Récupérer les créneaux d'emploi du temps pour le programme de l'examen
    const { data: timetableSlots, error: timetableError } = await supabase
      .from('timetables')
      .select(`
        *,
        subjects(*),
        rooms(*)
      `)
      .eq('program_id', examData.program_id)
      .eq('academic_year_id', examData.academic_year_id);

    if (timetableError) {
      console.error('Erreur récupération emploi du temps:', timetableError);
      throw timetableError;
    }

    // Analyser les conflits potentiels avec l'emploi du temps
    const conflicts = await detectTimetableConflicts(examData, timetableSlots || []);
    
    // Suggérer des créneaux alternatifs
    const suggestedSlots = await suggestAlternativeSlots(examData, timetableSlots || []);

    return {
      success: true,
      timetableSlots: timetableSlots || [],
      conflicts,
      suggestedSlots,
      syncedAt: new Date()
    };
  } catch (error) {
    console.error('Erreur synchronisation emploi du temps:', error);
    return {
      success: false,
      error: error,
      timetableSlots: [],
      conflicts: [],
      suggestedSlots: []
    };
  }
};

export const detectTimetableConflicts = async (examData: any, timetableSlots: any[]): Promise<any[]> => {
  const conflicts = [];

  for (const session of examData.exam_sessions || []) {
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    const sessionDay = sessionStart.getDay();

    // Convertir en format time pour comparaison
    const sessionStartTime = sessionStart.toTimeString().slice(0, 8);
    const sessionEndTime = sessionEnd.toTimeString().slice(0, 8);

    // Chercher les conflits avec l'emploi du temps
    const conflictingSlots = timetableSlots.filter(slot => {
      if (slot.day_of_week !== sessionDay) return false;
      
      const slotStart = slot.start_time;
      const slotEnd = slot.end_time;
      
      // Vérifier le chevauchement temporel
      return (sessionStartTime < slotEnd && sessionEndTime > slotStart);
    });

    if (conflictingSlots.length > 0) {
      conflicts.push({
        sessionId: session.id,
        conflictType: 'time_overlap',
        severity: 'high',
        message: `Conflit avec ${conflictingSlots.length} cours`,
        conflictingSlots: conflictingSlots.map(slot => ({
          subject: slot.subjects?.name,
          time: `${slot.start_time}-${slot.end_time}`,
          room: slot.rooms?.name || 'Non assignée'
        }))
      });
    }

    // Vérifier les conflits de salle
    if (session.room_id) {
      const roomConflicts = timetableSlots.filter(slot => 
        slot.room_id === session.room_id && 
        slot.day_of_week === sessionDay &&
        sessionStartTime < slot.end_time && sessionEndTime > slot.start_time
      );

      if (roomConflicts.length > 0) {
        conflicts.push({
          sessionId: session.id,
          conflictType: 'room_conflict',
          severity: 'critical',
          message: `Salle déjà occupée`,
          conflictingSlots: roomConflicts.map(slot => ({
            subject: slot.subjects?.name,
            time: `${slot.start_time}-${slot.end_time}`,
            room: slot.rooms?.name
          }))
        });
      }
    }
  }

  return conflicts;
};

export const suggestAlternativeSlots = async (examData: any, timetableSlots: any[]): Promise<any[]> => {
  const suggestions = [];
  const examDuration = examData.duration_minutes || 120;

  // Créneaux possibles (8h-18h, lundi-vendredi)
  const timeSlots = [
    '08:00:00', '10:00:00', '14:00:00', '16:00:00'
  ];
  const weekDays = [1, 2, 3, 4, 5]; // Lundi à Vendredi

  for (const day of weekDays) {
    for (const startTime of timeSlots) {
      // Calculer l'heure de fin
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(start.getTime() + examDuration * 60000);
      const endTime = end.toTimeString().slice(0, 8);

      // Vérifier s'il n'y a pas de conflit
      const hasConflict = timetableSlots.some(slot => 
        slot.day_of_week === day &&
        startTime < slot.end_time && 
        endTime > slot.start_time
      );

      if (!hasConflict) {
        suggestions.push({
          day: day,
          startTime,
          endTime,
          dayName: ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'][day],
          available: true
        });
      }
    }
  }

  return suggestions.slice(0, 10); // Limiter à 10 suggestions
};

export const checkTeacherAvailability = async (examData: any): Promise<any> => {
  try {
    const availabilityResults = [];

    for (const session of examData.exam_sessions || []) {
      const sessionStart = new Date(session.start_time);
      const sessionDay = sessionStart.getDay();
      const sessionStartTime = sessionStart.toTimeString().slice(0, 8);
      const sessionEndTime = new Date(session.end_time).toTimeString().slice(0, 8);

      // Récupérer tous les professeurs disponibles
      const { data: teachers, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');

      if (error) {
        console.error('Erreur récupération professeurs:', error);
        throw error;
      }

      for (const teacher of teachers || []) {
        // Récupérer la disponibilité du professeur
        const { data: availability } = await supabase
          .from('teacher_availability')
          .select('*')
          .eq('teacher_id', teacher.id)
          .eq('day_of_week', sessionDay);

        const isAvailable = availability?.some(slot => 
          slot.start_time <= sessionStartTime && 
          slot.end_time >= sessionEndTime
        ) || false;

        availabilityResults.push({
          sessionId: session.id,
          teacherId: teacher.id,
          teacherName: teacher.full_name,
          isAvailable,
          availabilitySlots: availability || [],
          sessionTime: `${sessionStartTime}-${sessionEndTime}`,
          day: sessionDay
        });
      }
    }

    return {
      success: true,
      teacherAvailability: availabilityResults,
      checkedAt: new Date()
    };
  } catch (error) {
    console.error('Erreur vérification disponibilité professeurs:', error);
    return {
      success: false,
      error: error,
      teacherAvailability: []
    };
  }
};

export const autoAssignSupervisors = async (examData: any): Promise<any> => {
  try {
    const assignedSupervisors = [];

    for (const session of examData.exam_sessions || []) {
      // Récupérer les professeurs du programme
      const { data: teachers, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');

      if (error) throw error;

      const availableTeachers = [];
      
      // Vérifier la disponibilité de chaque professeur
      for (const teacher of teachers || []) {
        const sessionStart = new Date(session.start_time);
        const sessionDay = sessionStart.getDay();
        const sessionStartTime = sessionStart.toTimeString().slice(0, 8);
        const sessionEndTime = new Date(session.end_time).toTimeString().slice(0, 8);

        const { data: availability } = await supabase
          .from('teacher_availability')
          .select('*')
          .eq('teacher_id', teacher.id)
          .eq('day_of_week', sessionDay);

        const isAvailable = availability?.some(slot => 
          slot.start_time <= sessionStartTime && 
          slot.end_time >= sessionEndTime
        ) || false;

        if (isAvailable) {
          availableTeachers.push({
            ...teacher,
            availability
          });
        }
      }

      // Assigner les surveillants nécessaires
      const requiredSupervisors = examData.min_supervisors || 1;
      const selectedTeachers = availableTeachers.slice(0, requiredSupervisors);

      for (const teacher of selectedTeachers) {
        // Créer l'assignation de surveillance
        const { data: assignment, error: assignError } = await supabase
          .from('exam_supervisors')
          .insert({
            session_id: session.id,
            teacher_id: teacher.id,
            supervisor_role: assignedSupervisors.length === 0 ? 'primary' : 'secondary',
            status: 'assigned'
          })
          .select()
          .single();

        if (!assignError && assignment) {
          assignedSupervisors.push({
            sessionId: session.id,
            teacherId: teacher.id,
            teacherName: teacher.full_name,
            role: assignment.supervisor_role,
            assignmentId: assignment.id
          });
        }
      }
    }

    return {
      success: true,
      assignedSupervisors,
      assignedAt: new Date()
    };
  } catch (error) {
    console.error('Erreur assignation surveillants:', error);
    return {
      success: false,
      error: error,
      assignedSupervisors: []
    };
  }
};
