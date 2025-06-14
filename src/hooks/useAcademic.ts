import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use the actual database types
type AcademicLevel = Database['public']['Tables']['academic_levels']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];
type Specialization = Database['public']['Tables']['specializations']['Row'];
type AcademicYear = Database['public']['Tables']['academic_years']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];
type ClassGroup = Database['public']['Tables']['class_groups']['Row'];
type TimetableSlot = Database['public']['Tables']['timetables']['Row'];

// Insert types for create operations
type SubjectInsert = Database['public']['Tables']['subjects']['Insert'];
type TimetableInsert = Database['public']['Tables']['timetables']['Insert'];
type TimetableUpdate = Database['public']['Tables']['timetables']['Update'];

// Hook for academic levels
export function useAcademicLevels() {
  const [data, setData] = useState<AcademicLevel[]>([]);
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
  const [data, setData] = useState<Subject[]>([]);
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

  const createSubject = async (subjectData: SubjectInsert) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subjectData)
        .select()
        .single();

      if (error) throw error;
      await fetchData(); // Refresh the list
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateSubject = async (id: string, updates: Database['public']['Tables']['subjects']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchData(); // Refresh the list
      return data;
    } catch (err) {
      throw err;
    }
  };

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData,
    createSubject,
    updateSubject
  };
}

// Hook for specializations by program
export function useSpecializations(programId?: string) {
  const [data, setData] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('specializations')
        .select('*')
        .order('name');

      if (programId) {
        query = query.eq('program_id', programId);
      }

      const { data: specializations, error } = await query;

      if (error) throw error;
      setData(specializations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programId]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for academic years
export function useAcademicYears() {
  const [data, setData] = useState<AcademicYear[]>([]);
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

  const getCurrentYear = () => {
    return data.find(year => year.is_current);
  };

  return { data, loading, error, refetch: fetchData, getCurrentYear };
}

// Hook for rooms
export function useRooms() {
  const [data, setData] = useState<Room[]>([]);
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
export function useClassGroups(programId?: string, academicYearId?: string) {
  const [data, setData] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('class_groups')
        .select('*')
        .order('name');

      if (programId) {
        query = query.eq('program_id', programId);
      }
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data: groups, error } = await query;

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
  }, [programId, academicYearId]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for timetables
export function useTimetables(filters?: {
  programId?: string;
  academicYearId?: string;
  teacherId?: string;
  roomId?: string;
  groupId?: string;
}) {
  const [data, setData] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('timetables')
        .select(`
          *,
          programs!inner(name, code),
          subjects!inner(name, code),
          profiles!timetables_teacher_id_fkey(full_name),
          rooms!inner(name, code, building),
          class_groups!inner(name, code)
        `)
        .order('day_of_week')
        .order('start_time');

      if (filters?.programId) {
        query = query.eq('program_id', filters.programId);
      }
      if (filters?.academicYearId) {
        query = query.eq('academic_year_id', filters.academicYearId);
      }
      if (filters?.teacherId) {
        query = query.eq('teacher_id', filters.teacherId);
      }
      if (filters?.roomId) {
        query = query.eq('room_id', filters.roomId);
      }
      if (filters?.groupId) {
        query = query.eq('group_id', filters.groupId);
      }

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
  }, [filters?.programId, filters?.academicYearId, filters?.teacherId, filters?.roomId, filters?.groupId]);

  const createTimetableSlot = async (slotData: TimetableInsert) => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .insert(slotData)
        .select()
        .single();

      if (error) throw error;
      await fetchData(); // Refresh the list
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateTimetableSlot = async (id: string, updates: TimetableUpdate) => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchData(); // Refresh the list
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteTimetableSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchData(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData,
    createTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot
  };
}

// Hook for program subjects relationship
export function useProgramSubjects(programId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('program_subjects')
        .select(`
          *,
          subjects!inner(*)
        `)
        .order('semester')
        .order('subjects(name)');

      if (programId) {
        query = query.eq('program_id', programId);
      }

      const { data: programSubjects, error } = await query;

      if (error) throw error;
      setData(programSubjects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programId]);

  const addSubjectToProgram = async (programId: string, subjectId: string, semester: number, isMandatory = true) => {
    try {
      const { data, error } = await supabase
        .from('program_subjects')
        .insert({
          program_id: programId,
          subject_id: subjectId,
          semester,
          is_mandatory: isMandatory
        })
        .select()
        .single();

      if (error) throw error;
      await fetchData(); // Refresh the list
      return data;
    } catch (err) {
      throw err;
    }
  };

  const removeSubjectFromProgram = async (id: string) => {
    try {
      const { error } = await supabase
        .from('program_subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchData(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData,
    addSubjectToProgram,
    removeSubjectFromProgram
  };
}