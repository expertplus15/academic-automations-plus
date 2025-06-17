
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
      const { data, error } = await supabase.rpc('detect_exam_conflicts', {
        p_academic_year_id: academicYearId
      });

      if (error) {
        setError(error.message);
      } else {
        setConflicts(data || []);
      }
    } catch (err) {
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
      const { error } = await supabase
        .from('exam_conflicts')
        .update({
          resolution_status: 'resolved',
          resolution_notes: resolution,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', conflictId);

      if (error) {
        setError(error.message);
      } else {
        // Retirer le conflit de la liste locale
        setConflicts(prev => prev.filter(c => c.conflict_id !== conflictId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la résolution');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    conflicts,
    loading,
    error,
    detectConflicts,
    generateSchedule,
    resolveConflict
  };
}
