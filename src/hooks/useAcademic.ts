import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook for academic levels
export function useAcademicLevels() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: levels, error } = await supabase
        .from('academic_levels')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setData(levels || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// Hook for subjects
export function useSubjects() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: subjects, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('status', 'active')
        .order('code');

      if (error) throw error;
      setData(subjects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// Hook for timetables
export function useTimetables(filters?: {
  academicYearId?: string;
  programId?: string;
  teacherId?: string;
  roomId?: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('timetables')
        .select(`
          *,
          subjects!timetables_subject_id_fkey(*),
          programs!timetables_program_id_fkey(*),
          profiles!timetables_teacher_id_fkey(*),
          rooms!timetables_room_id_fkey(*),
          class_groups!timetables_group_id_fkey(*),
          academic_years!timetables_academic_year_id_fkey(*)
        `)
        .eq('status', 'scheduled');

      if (filters?.academicYearId) {
        query = query.eq('academic_year_id', filters.academicYearId);
      }
      if (filters?.programId) {
        query = query.eq('program_id', filters.programId);
      }
      if (filters?.teacherId) {
        query = query.eq('teacher_id', filters.teacherId);
      }
      if (filters?.roomId) {
        query = query.eq('room_id', filters.roomId);
      }

      query = query.order('day_of_week').order('start_time');

      const { data: timetables, error } = await query;

      if (error) throw error;
      setData(timetables || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for academic years
export function useAcademicYears() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: years, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setData(years || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// Hook for rooms
export function useRooms() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available')
        .order('building', { ascending: true })
        .order('code', { ascending: true });

      if (error) throw error;
      setData(rooms || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// Hook for class groups
export function useClassGroups() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: groups, error } = await supabase
        .from('class_groups')
        .select('*')
        .order('name');

      if (error) throw error;
      setData(groups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// Current academic year hook
export function useCurrentAcademicYear() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: year, error } = await supabase
        .from('academic_years')
        .select('*')
        .eq('is_current', true)
        .single();

      if (error) throw error;
      setData(year);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}