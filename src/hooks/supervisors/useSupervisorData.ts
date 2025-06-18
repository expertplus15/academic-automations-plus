
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
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          department_id,
          teacher_availability!teacher_availability_teacher_id_fkey(
            day_of_week,
            start_time,
            end_time,
            is_preferred
          )
        `)
        .eq('role', 'teacher')
        .order('full_name');

      if (filters?.department) {
        query = query.eq('department_id', filters.department);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les surveillants',
          variant: 'destructive'
        });
      } else {
        const mappedSupervisors = (data || []).map((supervisor: any) => ({
          id: supervisor.id,
          teacher_id: supervisor.id,
          full_name: supervisor.full_name,
          email: supervisor.email,
          phone: supervisor.phone,
          department_id: supervisor.department_id,
          status: 'available',
          availability: supervisor.teacher_availability || [],
          current_load: 0,
          max_load: 20
        }));
        setSupervisors(mappedSupervisors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return {
    supervisors,
    loading,
    error,
    fetchSupervisors
  };
}
