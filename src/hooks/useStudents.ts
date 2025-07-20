
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: string;
  student_number: string;
  program_id: string;
  academic_year_id?: string;
  profile: {
    full_name: string;
    email: string;
  };
  program: {
    id: string;
    name: string;
    code: string;
  };
}

export function useStudents(academicYearId?: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('🔍 [STUDENTS] Fetching students for academic year:', academicYearId);
      
      let query = supabase
        .from('students')
        .select(`
          id,
          student_number,
          program_id,
          academic_year_id,
          profile:profiles!inner (
            full_name,
            email
          ),
          program:programs!inner (
            id,
            name,
            code
          )
        `)
        .eq('status', 'active')
        .order('student_number');

      // Filtrer par année académique si spécifiée
      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [STUDENTS] Error fetching students:', error);
        throw error;
      }
      
      console.log('✅ [STUDENTS] Successfully fetched', data?.length || 0, 'students');
      setStudents(data || []);
    } catch (error) {
      console.error('💥 [STUDENTS] Unexpected error:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [academicYearId]);

  return {
    students,
    loading,
    fetchStudents,
  };
}
