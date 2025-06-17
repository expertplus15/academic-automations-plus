
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Teacher {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  department_id?: string;
}

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, department_id')
          .eq('role', 'teacher')
          .order('full_name');

        if (error) {
          setError(error.message);
        } else {
          setTeachers(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return { teachers, loading, error };
}
