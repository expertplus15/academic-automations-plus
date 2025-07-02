import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: string;
  student_number: string;
  profile: {
    full_name: string;
    email: string;
  };
  program: {
    name: string;
    code: string;
  };
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          profile:profiles!inner (
            full_name,
            email
          ),
          program:programs!inner (
            name,
            code
          )
        `)
        .eq('status', 'active')
        .order('student_number');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    fetchStudents,
  };
}