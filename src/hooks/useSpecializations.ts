import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Specialization {
  id: string;
  name: string;
  code: string;
  program_id: string;
}

export function useSpecializations(programId: string) {
  const [data, setData] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!programId) {
      setData([]);
      return;
    }

    const fetchSpecializations = async () => {
      setLoading(true);
      setError('');
      
      try {
        const { data: specializations, error } = await supabase
          .from('specializations')
          .select('id, name, code, program_id')
          .eq('program_id', programId)
          .order('name');

        if (error) throw error;
        setData(specializations || []);
      } catch (err) {
        console.error('Error fetching specializations:', err);
        setError('Erreur lors du chargement des spécialisations');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, [programId]);

  return { data, loading, error };
}