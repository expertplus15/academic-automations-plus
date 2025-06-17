
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useAcademicYears() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        setError(error.message);
        setAcademicYears([]);
      } else {
        setAcademicYears(data || []);
        const current = data?.find(year => year.is_current);
        setCurrentYear(current || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setAcademicYears([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  return { 
    academicYears, 
    currentYear, 
    loading, 
    error, 
    refetch: fetchAcademicYears 
  };
}
