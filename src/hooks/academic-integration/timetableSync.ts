
import { supabase } from '@/integrations/supabase/client';

export const syncWithTimetable = async (examData: any) => {
  try {
    // Synchroniser les sessions d'examen avec l'emploi du temps
    for (const session of examData.exam_sessions || []) {
      // Créer ou mettre à jour les créneaux dans l'emploi du temps
      const { error } = await supabase
        .from('timetables')
        .upsert({
          subject_id: examData.subject_id,
          program_id: examData.program_id,
          academic_year_id: examData.academic_year_id,
          room_id: session.room_id,
          start_time: new Date(session.start_time).toTimeString().slice(0, 5),
          end_time: new Date(session.end_time).toTimeString().slice(0, 5),
          day_of_week: new Date(session.start_time).getDay(),
          slot_type: 'exam',
          status: 'scheduled'
        });

      if (error) {
        console.error('Erreur synchronisation emploi du temps:', error);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation avec l\'emploi du temps:', error);
  }
};

export const checkTeacherAvailability = async (examData: any) => {
  try {
    // Récupérer tous les superviseurs assignés
    const { data: supervisors } = await supabase
      .from('exam_supervisors')
      .select(`
        *,
        profiles!exam_supervisors_teacher_id_fkey(id, full_name),
        exam_sessions!exam_supervisors_session_id_fkey(start_time, end_time)
      `)
      .in('session_id', examData.exam_sessions?.map((s: any) => s.id) || []);

    if (!supervisors?.length) {
      console.log('Aucun superviseur assigné pour cet examen');
      return [];
    }

    const availabilityIssues = [];

    for (const supervisor of supervisors) {
      const teacherId = supervisor.teacher_id;
      const session = supervisor.exam_sessions;
      
      if (!session) continue;

      const sessionStart = new Date(session.start_time);
      const sessionEnd = new Date(session.end_time);
      const dayOfWeek = sessionStart.getDay();
      const startTime = sessionStart.toTimeString().slice(0, 5);
      const endTime = sessionEnd.toTimeString().slice(0, 5);

      // Vérifier la disponibilité déclarée du enseignant
      const { data: availability } = await supabase
        .from('teacher_availability')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('day_of_week', dayOfWeek)
        .eq('academic_year_id', examData.academic_year_id);

      const isAvailable = availability?.some(slot => 
        slot.start_time <= startTime && slot.end_time >= endTime
      );

      if (!isAvailable) {
        availabilityIssues.push({
          teacherId,
          teacherName: supervisor.profiles?.full_name,
          sessionId: supervisor.session_id,
          issue: 'not_available',
          message: `${supervisor.profiles?.full_name} n'est pas disponible le ${getDayName(dayOfWeek)} de ${startTime} à ${endTime}`
        });
      }

      // Vérifier les conflits avec d'autres cours
      const { data: teachingConflicts } = await supabase
        .from('timetables')
        .select(`
          *,
          subjects(name),
          rooms(name)
        `)
        .eq('teacher_id', teacherId)
        .eq('day_of_week', dayOfWeek)
        .eq('academic_year_id', examData.academic_year_id)
        .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime})`);

      if (teachingConflicts?.length) {
        availabilityIssues.push({
          teacherId,
          teacherName: supervisor.profiles?.full_name,
          sessionId: supervisor.session_id,
          issue: 'teaching_conflict',
          message: `${supervisor.profiles?.full_name} a cours de ${teachingConflicts[0].subjects?.name} en même temps`,
          conflictingSlots: teachingConflicts
        });
      }

      // Vérifier les conflits avec d'autres examens
      const { data: examConflicts } = await supabase
        .from('exam_supervisors')
        .select(`
          *,
          exam_sessions!exam_supervisors_session_id_fkey(
            start_time,
            end_time,
            exams!exam_sessions_exam_id_fkey(title)
          )
        `)
        .eq('teacher_id', teacherId)
        .eq('status', 'assigned')
        .neq('session_id', supervisor.session_id);

      const conflictingExams = examConflicts?.filter(conflict => {
        const conflictSession = conflict.exam_sessions;
        if (!conflictSession) return false;
        
        const conflictStart = new Date(conflictSession.start_time);
        const conflictEnd = new Date(conflictSession.end_time);
        
        return (
          (sessionStart <= conflictStart && sessionEnd > conflictStart) ||
          (sessionStart < conflictEnd && sessionEnd >= conflictEnd) ||
          (sessionStart >= conflictStart && sessionEnd <= conflictEnd)
        );
      });

      if (conflictingExams?.length) {
        availabilityIssues.push({
          teacherId,
          teacherName: supervisor.profiles?.full_name,
          sessionId: supervisor.session_id,
          issue: 'exam_conflict',
          message: `${supervisor.profiles?.full_name} supervise déjà un autre examen en même temps`,
          conflictingExams
        });
      }
    }

    return availabilityIssues;
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité des enseignants:', error);
    return [];
  }
};

export const findAvailableTeachers = async (sessionTime: Date, duration: number, academicYearId: string) => {
  try {
    const dayOfWeek = sessionTime.getDay();
    const startTime = sessionTime.toTimeString().slice(0, 5);
    const endTime = new Date(sessionTime.getTime() + duration * 60000).toTimeString().slice(0, 5);

    // Récupérer tous les enseignants disponibles
    const { data: availableTeachers } = await supabase
      .from('teacher_availability')
      .select(`
        teacher_id,
        profiles!teacher_availability_teacher_id_fkey(id, full_name, role)
      `)
      .eq('day_of_week', dayOfWeek)
      .eq('academic_year_id', academicYearId)
      .lte('start_time', startTime)
      .gte('end_time', endTime);

    if (!availableTeachers?.length) return [];

    const teacherIds = availableTeachers.map(t => t.teacher_id);

    // Exclure ceux qui ont déjà cours
    const { data: busyTeachers } = await supabase
      .from('timetables')
      .select('teacher_id')
      .in('teacher_id', teacherIds)
      .eq('day_of_week', dayOfWeek)
      .eq('academic_year_id', academicYearId)
      .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime})`);

    const busyTeacherIds = busyTeachers?.map(t => t.teacher_id) || [];

    // Exclure ceux qui supervisent déjà un examen
    const { data: supervisingTeachers } = await supabase
      .from('exam_supervisors')
      .select(`
        teacher_id,
        exam_sessions!exam_supervisors_session_id_fkey(start_time, end_time)
      `)
      .in('teacher_id', teacherIds)
      .eq('status', 'assigned');

    const supervisingTeacherIds = supervisingTeachers?.filter(supervisor => {
      const session = supervisor.exam_sessions;
      if (!session) return false;
      
      const sessStart = new Date(session.start_time);
      const sessEnd = new Date(session.end_time);
      
      return (
        (sessionTime <= sessStart && new Date(sessionTime.getTime() + duration * 60000) > sessStart) ||
        (sessionTime < sessEnd && new Date(sessionTime.getTime() + duration * 60000) >= sessEnd)
      );
    }).map(s => s.teacher_id) || [];

    // Filtrer les enseignants disponibles
    const freeTeachers = availableTeachers.filter(teacher => 
      !busyTeacherIds.includes(teacher.teacher_id) &&
      !supervisingTeacherIds.includes(teacher.teacher_id)
    );

    return freeTeachers.map(teacher => ({
      id: teacher.teacher_id,
      name: teacher.profiles?.full_name,
      role: teacher.profiles?.role
    }));
  } catch (error) {
    console.error('Erreur recherche enseignants disponibles:', error);
    return [];
  }
};

export const autoAssignSupervisors = async (examData: any) => {
  try {
    const assignments = [];
    
    for (const session of examData.exam_sessions || []) {
      const sessionStart = new Date(session.start_time);
      const duration = (new Date(session.end_time).getTime() - sessionStart.getTime()) / 60000; // en minutes
      
      // Calculer le nombre de superviseurs nécessaires
      const { data: registrations } = await supabase
        .from('exam_registrations')
        .select('id')
        .eq('session_id', session.id)
        .eq('status', 'registered');
      
      const studentCount = registrations?.length || 0;
      const requiredSupervisors = Math.max(1, Math.ceil(studentCount / 30)); // 1 superviseur pour 30 étudiants
      
      // Trouver les enseignants disponibles
      const availableTeachers = await findAvailableTeachers(
        sessionStart, 
        duration, 
        examData.academic_year_id
      );
      
      if (availableTeachers.length >= requiredSupervisors) {
        // Assigner les superviseurs
        const selectedTeachers = availableTeachers.slice(0, requiredSupervisors);
        
        for (let i = 0; i < selectedTeachers.length; i++) {
          const teacher = selectedTeachers[i];
          const assignment = {
            session_id: session.id,
            teacher_id: teacher.id,
            supervisor_role: i === 0 ? 'primary' : 'secondary',
            status: 'assigned',
            assigned_at: new Date().toISOString()
          };
          
          assignments.push(assignment);
        }
      } else {
        console.warn(`Pas assez d'enseignants disponibles pour la session ${session.id}: ${availableTeachers.length}/${requiredSupervisors}`);
      }
    }
    
    if (assignments.length > 0) {
      const { error } = await supabase
        .from('exam_supervisors')
        .upsert(assignments);
      
      if (error) {
        console.error('Erreur assignation superviseurs:', error);
      }
    }
    
    return assignments;
  } catch (error) {
    console.error('Erreur assignation automatique superviseurs:', error);
    return [];
  }
};

const getDayName = (dayIndex: number): string => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[dayIndex] || 'Jour inconnu';
};
