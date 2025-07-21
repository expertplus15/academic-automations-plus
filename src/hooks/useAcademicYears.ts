
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'completed';
  is_current: boolean;
  created_at: string;
  updated_at: string;
  validation_status: 'draft' | 'validated' | 'archived';
  is_archived: boolean;
  validated_at?: string;
  validated_by?: string;
  archived_at?: string;
  archived_by?: string;
  validated_by_profile?: {
    full_name: string;
  };
  archived_by_profile?: {
    full_name: string;
  };
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

      // Récupérer les années académiques sans jointures complexes
      const { data: yearsData, error: yearsError } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });

      if (yearsError) {
        console.error('Erreur lors de la récupération des années académiques:', yearsError);
        setError(yearsError.message);
        toast({
          title: "Erreur",
          description: "Impossible de charger les années académiques",
          variant: "destructive"
        });
        return;
      }

      // Récupérer les profils des validateurs/archiveurs si nécessaire
      const validatorIds = new Set();
      const archiverIds = new Set();

      yearsData?.forEach(year => {
        if (year.validated_by) validatorIds.add(year.validated_by);
        if (year.archived_by) archiverIds.add(year.archived_by);
      });

      const allUserIds = [...validatorIds, ...archiverIds];
      let profilesData: any[] = [];

      if (allUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', allUserIds);

        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Combiner les données
      const enrichedYears = yearsData?.map(year => ({
        ...year,
        validated_by_profile: year.validated_by 
          ? profilesData.find(p => p.id === year.validated_by)
          : null,
        archived_by_profile: year.archived_by 
          ? profilesData.find(p => p.id === year.archived_by)
          : null
      })) || [];

      setAcademicYears(enrichedYears as AcademicYear[]);
      const current = enrichedYears.find(year => year.is_current) || null;
      setCurrentYear(current as AcademicYear | null);

    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError('Une erreur inattendue est survenue');
      toast({
        title: "Erreur",
        description: "Impossible de charger les données académiques",
        variant: "destructive"
      });
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
