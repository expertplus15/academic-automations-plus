import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
          .maybeSingle();

        if (error) {
          console.error('Academic year fetch error:', error);
          throw error;
        }

        if (!data) {
          const fallbackMessage = 'Aucune année académique courante définie';
          console.warn(fallbackMessage);
          setError(fallbackMessage);
          toast({
            title: "Attention",
            description: "Aucune année académique courante. Contactez l'administrateur.",
            variant: "destructive",
          });
          return;
        }

        setCurrentYear(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la récupération de l\'année académique';
        console.error('Academic year loading error:', err);
        setError(message);
        setCurrentYear(null);
        
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentYear();
  }, []);

  return { currentYear, loading, error };
}