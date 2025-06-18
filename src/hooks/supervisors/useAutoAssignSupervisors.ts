
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Supervisor } from './types';
import { useSupervisorAvailability } from './useSupervisorAvailability';

export function useAutoAssignSupervisors(
  supervisors: Supervisor[],
  assignSupervisor: (sessionId: string, teacherId: string, role: 'primary' | 'secondary' | 'assistant') => Promise<any>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { getSupervisorAvailability } = useSupervisorAvailability();

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

  return {
    autoAssignSupervisors,
    loading,
    error
  };
}
