
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits_ects: number;
  level_id?: string;
  program_id?: string;
}

export function useSubjects(programId?: string) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('subjects')
          .select('id, name, code, credits_ects, level_id')
          .order('name');

        if (programId) {
          query = query.eq('program_id', programId);
        }

        const { data, error } = await query;

        if (error) {
          setError(error.message);
          setSubjects([]);
        } else {
          setSubjects(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [programId]);

  return { subjects, loading, error };
}
