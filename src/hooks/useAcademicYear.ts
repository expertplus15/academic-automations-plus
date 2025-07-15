import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: string;
}

export function useAcademicYear() {
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentYear = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('academic_years')
          .select('*')
          .eq('is_current', true)
          .single();

        if (error) {
          console.error('Academic year fetch error:', error);
          throw error;
        }

        setCurrentYear(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la récupération de l\'année académique';
        console.error('Academic year loading error:', err);
        setError(message);
        setCurrentYear(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentYear();
  }, []);

  return { currentYear, loading, error };
}