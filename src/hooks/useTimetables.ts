
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Timetable {
  id: string;
  subject_id?: string;
  program_id?: string;
  academic_year_id?: string;
  group_id?: string;
  room_id?: string;
  teacher_id?: string;
  day_of_week?: number;
  start_time: string;
  end_time: string;
  slot_type: string;
  status?: string;
  priority?: number;
  weight?: number;
  is_flexible?: boolean;
  preferred_start_time?: string;
  preferred_end_time?: string;
  max_daily_hours?: number;
  min_break_minutes?: number;
  recurrence_pattern?: any;
  exceptions?: any;
  created_at: string;
  updated_at: string;
  // Relations
  subject?: {
    name: string;
    code: string;
  };
  room?: {
    name: string;
    code: string;
  };
  teacher?: {
    full_name: string;
  };
  program?: {
    name: string;
    code: string;
  };
}

export function useTimetables(programId?: string, academicYearId?: string) {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('timetables')
        .select(`
          *,
          subject:subjects(name, code),
          room:rooms(name, code),
          teacher:profiles!timetables_teacher_id_fkey(full_name),
          program:programs(name, code)
        `)
        .order('day_of_week')
        .order('start_time');

      if (programId) {
        query = query.eq('program_id', programId);
      }
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setTimetables(data as Timetable[] || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createTimetable = async (timetableData: Partial<Timetable>) => {
    const { data, error } = await supabase
      .from('timetables')
      .insert(timetableData)
      .select()
      .single();

    if (!error) {
      fetchTimetables();
    }
    return { data, error };
  };

  const updateTimetable = async (id: string, updates: Partial<Timetable>) => {
    const { data, error } = await supabase
      .from('timetables')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error) {
      fetchTimetables();
    }
    return { data, error };
  };

  const deleteTimetable = async (id: string) => {
    const { error } = await supabase
      .from('timetables')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchTimetables();
    }
    return { error };
  };

  useEffect(() => {
    fetchTimetables();
  }, [programId, academicYearId]);

  return {
    timetables,
    loading,
    error,
    refetch: fetchTimetables,
    createTimetable,
    updateTimetable,
    deleteTimetable
  };
}
