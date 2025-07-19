
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'current' | 'completed';
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export function useAcademicYears() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des années académiques:', error);
        setError(error.message);
        toast({
          title: "Erreur",
          description: "Impossible de charger les années académiques",
          variant: "destructive"
        });
      } else {
        setAcademicYears(data || []);
        const current = data?.find(year => year.is_current) || null;
        setCurrentYear(current);
      }
    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const refetch = () => {
    fetchAcademicYears();
  };

  return { 
    academicYears, 
    currentYear,
    loading, 
    error, 
    refetch
  };
}
