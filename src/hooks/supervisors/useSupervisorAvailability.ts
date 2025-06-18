
import { supabase } from '@/integrations/supabase/client';

export function useSupervisorAvailability() {
  const getSupervisorAvailability = async (
    teacherId: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('exam_supervisors')
        .select(`
          id,
          exam_sessions!exam_supervisors_session_id_fkey(
            start_time,
            end_time
          )
        `)
        .eq('teacher_id', teacherId)
        .eq('status', 'assigned');

      if (error) {
        console.error('Erreur vérification disponibilité surveillant:', error);
        return false;
      }

      // Vérifier les conflits de temps
      const hasConflict = (data || []).some((assignment: any) => {
        const session = assignment.exam_sessions;
        if (!session) return false;
        
        const assignmentStart = new Date(session.start_time);
        const assignmentEnd = new Date(session.end_time);
        const requestStart = new Date(startTime);
        const requestEnd = new Date(endTime);

        return (
          (requestStart >= assignmentStart && requestStart < assignmentEnd) ||
          (requestEnd > assignmentStart && requestEnd <= assignmentEnd) ||
          (requestStart <= assignmentStart && requestEnd >= assignmentEnd)
        );
      });

      return !hasConflict;
    } catch (err) {
      console.error('Erreur:', err);
      return false;
    }
  };

  return {
    getSupervisorAvailability
  };
}
