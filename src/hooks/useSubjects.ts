
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits_ects: number;
  level_id?: string;
  program_id?: string;
  coefficient?: number;
  status?: string;
}

export function useSubjects(programId?: string, levelId?: string) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 [SUBJECTS] Fetching subjects with filters:', {
          programId,
          levelId
        });
        
        let query = supabase
          .from('subjects')
          .select('id, name, code, credits_ects, level_id, program_id, coefficient, status')
          .eq('status', 'active')
          .order('name');

        // Appliquer les filtres en cascade
        if (programId) {
          query = query.eq('program_id', programId);
        }

        if (levelId) {
          query = query.eq('level_id', levelId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('❌ [SUBJECTS] Error fetching subjects:', error);
          setError(error.message);
          setSubjects([]);
        } else {
          console.log('✅ [SUBJECTS] Successfully fetched', data?.length || 0, 'subjects with filters applied');
          setSubjects(data || []);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue';
        console.error('💥 [SUBJECTS] Unexpected error:', err);
        setError(message);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [programId, levelId]);

  return { subjects, loading, error };
}
