
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduleGeneration {
  id: string;
  program_id?: string;
  academic_year_id?: string;
  generation_type: string;
  parameters: any;
  status: string;
  progress_percentage: number;
  conflicts_count: number;
  success_rate?: number;
  generated_by?: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface ScheduleConflict {
  conflict_id: string;
  conflict_type: string;
  severity: string;
  description: string;
  affected_slots: any;
}

export interface GenerationParameters {
  max_daily_hours?: number;
  min_break_minutes?: number;
  preferred_start_time?: string;
  preferred_end_time?: string;
  respect_teacher_preferences?: boolean;
  optimize_room_usage?: boolean;
}

export function useScheduleGeneration() {
  const [generations, setGenerations] = useState<ScheduleGeneration[]>([]);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenerations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedule_generations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setGenerations(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const detectConflicts = async (academicYearId?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('detect_schedule_conflicts', {
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
  };

  const generateSchedule = async (
    programId: string,
    academicYearId: string,
    parameters: GenerationParameters = {}
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('generate_smart_schedule', {
        p_program_id: programId,
        p_academic_year_id: academicYearId,
        p_parameters: parameters
      });

      if (error) {
        setError(error.message);
        return null;
      } else {
        // Rafraîchir la liste des générations
        await fetchGenerations();
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  return {
    generations,
    conflicts,
    loading,
    error,
    fetchGenerations,
    detectConflicts,
    generateSchedule
  };
}
