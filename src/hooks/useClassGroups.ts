
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
  level_id?: string;
}

export function useClassGroups(programId?: string, academicYearId?: string, levelId?: string) {
  const [groups, setGroups] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [CLASS_GROUPS] Fetching class groups with filters:', {
        programId,
        academicYearId,
        levelId
      });
      
      let query = supabase
        .from('class_groups')
        .select('id, name, code, max_students, current_students, group_type, program_id, academic_year_id, level_id')
        .order('name');

      // Appliquer les filtres en cascade
      if (programId) {
        query = query.eq('program_id', programId);
      }
      
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      if (levelId) {
        query = query.eq('level_id', levelId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [CLASS_GROUPS] Error fetching class groups:', error);
        setError(error.message);
        setGroups([]);
      } else {
        console.log('✅ [CLASS_GROUPS] Successfully fetched', data?.length || 0, 'class groups with filters applied');
        setGroups(data || []);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      console.error('💥 [CLASS_GROUPS] Unexpected error:', err);
      setError(message);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [programId, academicYearId, levelId]);

  return { 
    groups, 
    loading, 
    error,
    data: groups,
    refetch
  };
}
