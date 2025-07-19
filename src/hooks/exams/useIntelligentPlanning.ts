
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ExamSlot {
  id: string;
  exam_id: string;
  room_id?: string;
  start_time: string;
  end_time: string;
  date: string;
  status: string;
  conflicts?: string[];
}

export interface PlanningConflict {
  conflict_id: string;
  conflict_type: string;
  severity: string;
  title: string;
  description: string;
  affected_data: any;
}

export function useIntelligentPlanning() {
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState<PlanningConflict[]>([]);
  const { toast } = useToast();

  const generateAutoPlan = useCallback(async (sessionGroupId: string) => {
    try {
      setLoading(true);
      
      // Récupérer les examens de la session
      const { data: exams, error: examsError } = await supabase
        .from('exams')
        .select('*')
        .eq('session_group_id', sessionGroupId);

      if (examsError) throw examsError;

      if (!exams || exams.length === 0) {
        throw new Error('Aucun examen trouvé pour cette session');
      }

      // Utiliser la fonction SQL pour générer le planning
      const { data: generationId, error: planError } = await supabase
        .rpc('generate_exam_schedule', {
          p_academic_year_id: '550e8400-e29b-41d4-a716-446655440001',
          p_program_id: '550e8400-e29b-41d4-a716-446655440002',
          p_parameters: {
            max_daily_hours: 6,
            min_break_minutes: 30,
            preferred_start_time: '08:00',
            preferred_end_time: '17:00',
            session_group_id: sessionGroupId
          }
        });

      if (planError) throw planError;

      // Récupérer les sessions créées
      const { data: sessions, error: sessionsError } = await supabase
        .from('exam_sessions')
        .select(`
          *,
          exams!inner(title, session_group_id),
          rooms(name)
        `)
        .eq('exams.session_group_id', sessionGroupId);

      if (sessionsError) throw sessionsError;

      // Détecter les conflits
      await detectConflicts(sessionGroupId);

      toast({
        title: 'Planification générée avec IA',
        description: `${sessions?.length || 0} examens planifiés automatiquement avec résolution de conflits`
      });

      return sessions || [];
    } catch (err) {
      console.error('Erreur planification:', err);
      toast({
        title: 'Erreur de planification',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const detectConflicts = useCallback(async (sessionGroupId?: string) => {
    try {
      // Utiliser la fonction SQL de détection de conflits
      const { data: conflictsData, error } = await supabase
        .rpc('detect_exam_conflicts', {
          p_academic_year_id: '550e8400-e29b-41d4-a716-446655440001'
        });

      if (error) throw error;

      const detectedConflicts: PlanningConflict[] = (conflictsData || []).map((conflict: any) => ({
        conflict_id: conflict.conflict_id,
        conflict_type: conflict.conflict_type,
        severity: conflict.severity,
        title: conflict.title,
        description: conflict.description,
        affected_data: conflict.affected_data
      }));

      setConflicts(detectedConflicts);
      return detectedConflicts;
    } catch (err) {
      console.error('Erreur détection conflits:', err);
      return [];
    }
  }, []);

  const updateExamSession = useCallback(async (
    sessionId: string, 
    updates: Partial<ExamSlot>
  ) => {
    try {
      const { error } = await supabase
        .from('exam_sessions')
        .update({
          room_id: updates.room_id,
          start_time: updates.start_time,
          end_time: updates.end_time,
          status: updates.status
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: 'Session mise à jour',
        description: 'La planification a été modifiée avec succès'
      });

      return true;
    } catch (err) {
      toast({
        title: 'Erreur de mise à jour',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  const optimizeSchedule = useCallback(async (sessionGroupId: string) => {
    try {
      setLoading(true);

      // Récupérer les statistiques avant optimisation
      const conflictsBefore = await detectConflicts(sessionGroupId);
      
      // Relancer la génération avec paramètres optimisés
      await generateAutoPlan(sessionGroupId);
      
      // Vérifier l'amélioration
      const conflictsAfter = await detectConflicts(sessionGroupId);
      
      const improvement = Math.max(0, conflictsBefore.length - conflictsAfter.length);
      
      toast({
        title: 'Optimisation terminée',
        description: `${improvement} conflit(s) résolu(s) par l'IA`
      });

      return {
        conflictsResolved: improvement,
        remainingConflicts: conflictsAfter.length,
        optimizationRate: conflictsBefore.length > 0 ? 
          Math.round((improvement / conflictsBefore.length) * 100) : 100
      };
    } catch (err) {
      console.error('Erreur optimisation:', err);
      return {
        conflictsResolved: 0,
        remainingConflicts: conflicts.length,
        optimizationRate: 0
      };
    } finally {
      setLoading(false);
    }
  }, [conflicts.length]);

  return {
    loading,
    conflicts,
    generateAutoPlan,
    detectConflicts,
    updateExamSession,
    optimizeSchedule
  };
}
