
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  student_number: string;
  status: string;
  year_level: number;
  enrollment_date: string;
  created_at: string;
  current_academic_year_id?: string;
  academic_year_id?: string;
  profiles: {
    id: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
  programs: {
    id: string;
    name: string;
    code: string;
    departments: {
      name: string;
    };
  };
}

export function useStudentsData(academicYearId?: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [STUDENTS_DATA] Fetching students for academic year:', academicYearId);

      let query = supabase
        .from('students')
        .select(`
          id,
          student_number,
          status,
          year_level,
          enrollment_date,
          created_at,
          current_academic_year_id,
          academic_year_id,
          profiles!students_profile_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          programs!students_program_id_fkey (
            id,
            name,
            code,
            departments!programs_department_id_fkey (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      // Filtrer par année académique courante si spécifiée
      if (academicYearId) {
        query = query.eq('current_academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [STUDENTS_DATA] Error fetching students:', error);
        setError(error.message);
      } else {
        console.log('✅ [STUDENTS_DATA] Successfully fetched', data?.length || 0, 'students');
        console.log('🔍 [STUDENTS_DATA] Filter applied: current_academic_year_id =', academicYearId);
        
        // Enrichir les données avec des champs vides pour first_name et last_name
        const enrichedData = (data || []).map((student: any) => ({
          ...student,
          profiles: {
            ...student.profiles,
            first_name: undefined,
            last_name: undefined
          }
        }));
        
        setStudents(enrichedData);
      }
    } catch (err) {
      console.error('💥 [STUDENTS_DATA] Unexpected error:', err);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [academicYearId]);

  const refetch = () => {
    console.log('🔄 [STUDENTS_DATA] Refetching students data');
    fetchStudents();
  };

  return { students, loading, error, refetch };
}
