import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Program {
  id: string;
  name: string;
  code: string;
  description?: string;
  department_id?: string;
  level_id?: string;
  duration_years?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .order('name');

        if (error) {
          console.error('Programs fetch error:', error);
          throw error;
        }

        console.log('Fetched programs:', data?.length || 0);
        setPrograms(data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des programmes';
        console.error('Programs loading error:', err);
        setError(message);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return { programs, loading, error };
}