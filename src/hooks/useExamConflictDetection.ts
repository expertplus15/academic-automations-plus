
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExamConflict } from './useExams';

export function useExamConflictDetection() {
  const [conflicts, setConflicts] = useState<ExamConflict[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectConflicts = useCallback(async (academicYearId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Si on passe "current", récupérer l'ID de l'année académique courante
      let yearId = academicYearId;
      if (academicYearId === "current") {
        const { data: currentYear } = await supabase
          .from('academic_years')
          .select('id')
          .eq('is_current', true)
          .single();
        yearId = currentYear?.id;
      }
      
      const { data, error } = await supabase.rpc('detect_exam_conflicts', {
        p_academic_year_id: yearId
      });

      if (error) {
        console.error('Erreur de détection de conflits:', error);
        setError(error.message);
      } else {
        // Mapping des données pour s'assurer de la compatibilité des types
        const mappedConflicts = (data || []).map((conflict: any) => ({
          conflict_id: conflict.conflict_id,
          conflict_type: conflict.conflict_type,
          severity: conflict.severity,
          title: conflict.title,
          description: conflict.description,
          affected_data: conflict.affected_data
        }));
        console.log('Conflits détectés:', mappedConflicts);
        setConflicts(mappedConflicts);
      }
    } catch (err) {
      console.error('Erreur lors de la détection des conflits:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la détection des conflits');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSchedule = useCallback(async (
    academicYearId: string,
    programId?: string,
    parameters: any = {}
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('generate_exam_schedule', {
        p_academic_year_id: academicYearId,
        p_program_id: programId,
        p_parameters: parameters
      });

      if (error) {
        setError(error.message);
        return null;
      } else {
        // Redétecter les conflits après génération
        await detectConflicts(academicYearId);
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération');
      return null;
    } finally {
      setLoading(false);
    }
  }, [detectConflicts]);

  const resolveConflict = useCallback(async (conflictId: string, resolution: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Pour l'instant, on simule une résolution en retirant le conflit de la liste
      // En production, ceci ferait appel à une logique de résolution automatique
      console.log(`Résolution du conflit ${conflictId} avec méthode: ${resolution}`);
      
      if (resolution === 'Automatique') {
        // Simulation de résolution automatique
        // Ici on pourrait décaler l'horaire, changer de salle, etc.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation de traitement
      }
      
      // Retirer le conflit de la liste locale (simulation de résolution)
      setConflicts(prev => prev.filter(c => c.conflict_id !== conflictId));
      
      // Redétecter les conflits pour vérifier que la résolution a fonctionné
      await detectConflicts("current");
      
    } catch (err) {
      console.error('Erreur lors de la résolution:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la résolution');
    } finally {
      setLoading(false);
    }
  }, [detectConflicts]);

  return {
    conflicts,
    loading,
    error,
    detectConflicts,
    generateSchedule,
    resolveConflict
  };
}
