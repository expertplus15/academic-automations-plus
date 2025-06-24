
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Supervisor, SupervisorFilters } from './types';

export function useSupervisorData() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSupervisors = async (filters?: SupervisorFilters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          department_id
        `)
        .eq('role', 'teacher')
        .order('full_name');

      if (filters?.department) {
        query = query.eq('department_id', filters.department);
      }

      const { data: profilesData, error: profilesError } = await query;

      if (profilesError) {
        setError(profilesError.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les surveillants',
          variant: 'destructive'
        });
        return;
      }

      // Récupérer les disponibilités séparément
      const profileIds = profilesData?.map(p => p.id) || [];
      let availabilityData: any[] = [];
      
      if (profileIds.length > 0) {
        const { data: availability } = await supabase
          .from('teacher_availability')
          .select('*')
          .in('teacher_id', profileIds);
        
        availabilityData = availability || [];
      }

      const mappedSupervisors: Supervisor[] = (profilesData || []).map(profile => ({
        id: profile.id,
        teacher_id: profile.id,
        full_name: profile.full_name || '',
        email: profile.email,
        phone: profile.phone,
        department_id: profile.department_id,
        status: 'available',
        availability: availabilityData
          .filter(av => av.teacher_id === profile.id)
          .map(av => ({
            day_of_week: av.day_of_week,
            start_time: av.start_time,
            end_time: av.end_time,
            is_preferred: av.is_preferred
          })),
        current_load: 0,
        max_load: 20
      }));

      setSupervisors(mappedSupervisors);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSupervisorStatus = async (supervisorId: string, status: string) => {
    try {
      setLoading(true);
      
      setSupervisors(prev => 
        prev.map(sup => 
          sup.id === supervisorId ? { ...sup, status } : sup
        )
      );

      toast({
        title: 'Statut mis à jour',
        description: 'Le statut du surveillant a été modifié'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return {
    supervisors,
    loading,
    error,
    fetchSupervisors,
    updateSupervisorStatus
  };
}
