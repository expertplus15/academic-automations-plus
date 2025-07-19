import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StudentAcademicEnrollment {
  id: string;
  student_id: string;
  academic_year_id: string;
  program_id: string | null;
  level_id: string | null;
  enrollment_status: string;
  student: {
    id: string;
    student_number: string;
    profile: {
      full_name: string;
    };
  };
}

export function useStudentAcademicEnrollments(academicYearId?: string, programId?: string) {
  const [enrollments, setEnrollments] = useState<StudentAcademicEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!academicYearId) {
      setEnrollments([]);
      return;
    }

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('student_academic_enrollments')
          .select(`
            *,
            student:students(
              id,
              student_number,
              profile:profiles(full_name)
            )
          `)
          .eq('academic_year_id', academicYearId)
          .eq('enrollment_status', 'active')
          .order('student_number', { referencedTable: 'students' });

        if (programId) {
          query = query.eq('program_id', programId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setEnrollments(data || []);
      } catch (err) {
        console.error('Error fetching student enrollments:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [academicYearId, programId]);

  return { enrollments, loading, error };
}