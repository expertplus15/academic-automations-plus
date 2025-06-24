
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
      setError(null);
      
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
        if (isAvailable && supervisor.status === 'available') {
          availableSupervisors.push(supervisor);
        }
      }

      if (availableSupervisors.length < requiredCount) {
        const message = `Seulement ${availableSupervisors.length} surveillant(s) disponible(s) sur ${requiredCount} requis`;
        toast({
          title: 'Surveillants insuffisants',
          description: message,
          variant: 'destructive'
        });
        setError(message);
        return false;
      }

      // Assigner les surveillants (tri par charge de travail croissante)
      const sortedSupervisors = availableSupervisors
        .sort((a, b) => (a.current_load || 0) - (b.current_load || 0))
        .slice(0, requiredCount);

      const assignments = [];
      for (let i = 0; i < sortedSupervisors.length; i++) {
        const role: 'primary' | 'secondary' | 'assistant' = 
          i === 0 ? 'primary' : 
          i === 1 ? 'secondary' : 
          'assistant';
        
        const result = await assignSupervisor(sessionId, sortedSupervisors[i].teacher_id, role);
        if (result) {
          assignments.push({
            supervisor: sortedSupervisors[i],
            role
          });
        }
      }

      if (assignments.length > 0) {
        toast({
          title: 'Attribution automatique réussie',
          description: `${assignments.length} surveillant(s) assigné(s) avec succès`
        });
        return true;
      } else {
        throw new Error('Aucune assignation n\'a pu être effectuée');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'attribution automatique';
      setError(errorMessage);
      toast({
        title: 'Erreur d\'attribution',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const suggestOptimalAssignment = async (sessionId: string) => {
    try {
      // Récupérer les informations de la session
      const { data: session, error: sessionError } = await supabase
        .from('exam_sessions')
        .select(`
          start_time, 
          end_time,
          exams!exam_sessions_exam_id_fkey(min_supervisors)
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError || !session) {
        throw new Error('Session introuvable');
      }

      const requiredCount = session.exams?.min_supervisors || 1;
      
      // Évaluer chaque surveillant
      const evaluations = [];
      for (const supervisor of supervisors) {
        const isAvailable = await getSupervisorAvailability(
          supervisor.teacher_id,
          session.start_time,
          session.end_time
        );

        if (isAvailable && supervisor.status === 'available') {
          // Calculer un score basé sur la charge de travail et les préférences
          const loadScore = Math.max(0, 100 - ((supervisor.current_load || 0) * 5));
          const availabilityScore = supervisor.availability?.length ? 
            supervisor.availability.filter(av => av.is_preferred).length * 10 : 0;
          
          const totalScore = loadScore + availabilityScore;
          
          evaluations.push({
            supervisor,
            score: totalScore,
            isAvailable
          });
        }
      }

      // Trier par score décroissant
      evaluations.sort((a, b) => b.score - a.score);
      
      return {
        suggestions: evaluations.slice(0, requiredCount * 2), // Double pour avoir des alternatives
        requiredCount,
        availableCount: evaluations.length
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse');
      return null;
    }
  };

  return {
    autoAssignSupervisors,
    suggestOptimalAssignment,
    loading,
    error
  };
}
