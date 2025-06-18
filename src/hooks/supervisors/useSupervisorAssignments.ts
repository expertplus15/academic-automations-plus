
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SupervisorAssignment } from './types';

export function useSupervisorAssignments() {
  const [assignments, setAssignments] = useState<SupervisorAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    assignSupervisor,
    unassignSupervisor,
    confirmAssignment
  };
}
