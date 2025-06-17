
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ClassGroup {
  id: string;
  name: string;
  code: string;
  max_students: number;
  current_students: number;
  group_type: string;
  program_id?: string;
  academic_year_id?: string;
}

export function useClassGroups(programId?: string, academicYearId?: string) {
  const [groups, setGroups] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('class_groups')
        .select('id, name, code, max_students, current_students, group_type, program_id, academic_year_id')
        .order('name');

      if (programId) {
        query = query.eq('program_id', programId);
      }
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        setGroups([]);
      } else {
        setGroups(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [programId, academicYearId]);

  return { 
    groups, 
    loading, 
    error,
    data: groups,
    refetch
  };
}
