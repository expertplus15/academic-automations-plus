import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Supervisor {
  id: string;
  teacher_id: string;
  full_name: string;
  email: string;
  department_id?: string;
  phone?: string;
  status: string;
  specializations?: string[];
  availability?: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_preferred: boolean;
  }[];
  current_load?: number;
  max_load?: number;
}

export interface SupervisorAssignment {
  id: string;
  session_id: string;
  teacher_id: string;
  supervisor_role: 'primary' | 'secondary' | 'assistant';
  status: 'assigned' | 'confirmed' | 'declined' | 'replaced';
  assigned_at: string;
  confirmed_at?: string;
  notes?: string;
}

export function useSupervisors() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [assignments, setAssignments] = useState<SupervisorAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSupervisors = async (filters?: {
    department?: string;
    available?: boolean;
    specialization?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          department_id,
          teacher_availability!teacher_availability_teacher_id_fkey(
            day_of_week,
            start_time,
            end_time,
            is_preferred
          )
        `)
        .eq('role', 'teacher')
        .order('full_name');

      if (filters?.department) {
        query = query.eq('department_id', filters.department);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les surveillants',
          variant: 'destructive'
        });
      } else {
        const mappedSupervisors = (data || []).map((supervisor: any) => ({
          id: supervisor.id,
          teacher_id: supervisor.id,
          full_name: supervisor.full_name,
          email: supervisor.email,
          phone: supervisor.phone,
          department_id: supervisor.department_id,
          status: 'available',
          availability: supervisor.teacher_availability || [],
          current_load: 0,
          max_load: 20
        }));
        setSupervisors(mappedSupervisors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (sessionId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('exam_supervisors')
        .select(`
          id,
          session_id,
          teacher_id,
          supervisor_role,
          status,
          assigned_at,
          confirmed_at,
          profiles!exam_supervisors_teacher_id_fkey(full_name, email)
        `)
        .order('assigned_at', { ascending: false });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        // Type the assignments properly with explicit casting
        const typedAssignments: SupervisorAssignment[] = (data || []).map((assignment: any) => ({
          id: assignment.id,
          session_id: assignment.session_id,
          teacher_id: assignment.teacher_id,
          supervisor_role: assignment.supervisor_role as 'primary' | 'secondary' | 'assistant',
          status: assignment.status as 'assigned' | 'confirmed' | 'declined' | 'replaced',
          assigned_at: assignment.assigned_at,
          confirmed_at: assignment.confirmed_at,
          notes: assignment.notes
        }));
        setAssignments(typedAssignments);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const assignSupervisor = async (
    sessionId: string,
    teacherId: string,
    role: 'primary' | 'secondary' | 'assistant' = 'primary'
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exam_supervisors')
        .insert({
          session_id: sessionId,
          teacher_id: teacherId,
          supervisor_role: role,
          status: 'assigned'
        })
        .select()
        .single();

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible d\'assigner le surveillant',
          variant: 'destructive'
        });
        return null;
      } else {
        toast({
          title: 'Surveillant assigné',
          description: 'Le surveillant a été assigné avec succès'
        });
        await fetchAssignments();
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'assignation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const unassignSupervisor = async (assignmentId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('exam_supervisors')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de retirer le surveillant',
          variant: 'destructive'
        });
        return false;
      } else {
        toast({
          title: 'Surveillant retiré',
          description: 'Le surveillant a été retiré avec succès'
        });
        await fetchAssignments();
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du retrait');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const confirmAssignment = async (assignmentId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('exam_supervisors')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de confirmer l\'assignation',
          variant: 'destructive'
        });
        return false;
      } else {
        toast({
          title: 'Assignation confirmée',
          description: 'Le surveillant a confirmé sa présence'
        });
        await fetchAssignments();
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la confirmation');
      return false;
    } finally {
      setLoading(false);
    }
  };

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

  const autoAssignSupervisors = async (sessionId: string, requiredCount: number = 1) => {
    try {
      setLoading(true);
      
      // Récupérer les informations de la session
      const { data: session, error: sessionError } = await supabase
        .from('exam_sessions')
        .select('start_time, end_time')
        .eq('id', sessionId)
        .single();

      if (sessionError || !session) {
        throw new Error('Session introuvable');
      }

      // Trouver les surveillants disponibles
      const availableSupervisors = [];
      for (const supervisor of supervisors) {
        const isAvailable = await getSupervisorAvailability(
          supervisor.teacher_id,
          session.start_time,
          session.end_time
        );
        if (isAvailable) {
          availableSupervisors.push(supervisor);
        }
      }

      if (availableSupervisors.length < requiredCount) {
        toast({
          title: 'Surveillants insuffisants',
          description: `Seulement ${availableSupervisors.length} surveillant(s) disponible(s) sur ${requiredCount} requis`,
          variant: 'destructive'
        });
        return false;
      }

      // Assigner les surveillants (tri par charge de travail)
      const sortedSupervisors = availableSupervisors
        .sort((a, b) => (a.current_load || 0) - (b.current_load || 0))
        .slice(0, requiredCount);

      for (let i = 0; i < sortedSupervisors.length; i++) {
        const role = i === 0 ? 'primary' : 'secondary';
        await assignSupervisor(sessionId, sortedSupervisors[i].teacher_id, role);
      }

      toast({
        title: 'Attribution automatique réussie',
        description: `${sortedSupervisors.length} surveillant(s) assigné(s)`
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'attribution automatique');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
    fetchAssignments();
  }, []);

  return {
    supervisors,
    assignments,
    loading,
    error,
    fetchSupervisors,
    fetchAssignments,
    assignSupervisor,
    unassignSupervisor,
    confirmAssignment,
    getSupervisorAvailability,
    autoAssignSupervisors
  };
}
