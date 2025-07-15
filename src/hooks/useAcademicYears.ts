
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
      setError(null);
      
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Academic years fetch error:', error);
        throw error;
      }

      const years = data || [];
      setAcademicYears(years);
      
      const currentYears = years.filter(year => year.is_current);
      
      // Détection et alerte pour multiple années courantes
      if (currentYears.length > 1) {
        console.error('Multiple current academic years detected:', currentYears);
        toast({
          title: "Erreur de configuration",
          description: `${currentYears.length} années académiques marquées comme courantes. Contactez l'administrateur.`,
          variant: "destructive",
        });
      }
      
      setCurrentYear(currentYears[0] || null);
      
      if (currentYears.length === 0 && years.length > 0) {
        console.warn('No current academic year found');
        toast({
          title: "Attention",
          description: "Aucune année académique courante définie.",
          variant: "destructive",
        });
      }
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des années académiques';
      console.error('Academic years loading error:', err);
      setError(message);
      setAcademicYears([]);
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
