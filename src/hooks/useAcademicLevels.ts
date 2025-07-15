import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AcademicLevel {
  id: string;
  name: string;
  code: string;
  order_index: number;
}

export function useAcademicLevels() {
  const [data, setData] = useState<AcademicLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLevels = async () => {
      setLoading(true);
      setError('');
      
      try {
        const { data: levels, error } = await supabase
          .from('academic_levels')
          .select('id, name, code, order_index')
          .order('order_index');

        if (error) throw error;
        setData(levels || []);
      } catch (err) {
        console.error('Error fetching academic levels:', err);
        setError('Erreur lors du chargement des niveaux');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  return { data, loading, error };
}