
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StudentPerformance {
  id: string;
  student_number: string;
  profiles: {
    full_name: string;
  };
  programs: {
    name: string;
    code: string;
  };
  averageGrade: number;
  attendanceRate: number;
  trend: number;
}

export function useStudentsPerformance() {
  const [students, setStudents] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentsPerformance = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les étudiants avec leurs informations de base
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          profiles!students_profile_id_fkey (
            full_name
          ),
          programs!students_program_id_fkey (
            name,
            code
          )
        `)
        .limit(50);

      if (studentsError) {
        throw studentsError;
      }

      // Pour chaque étudiant, calculer ses performances
      const studentsWithPerformance = await Promise.all(
        (studentsData || []).map(async (student) => {
          // Récupérer la moyenne des notes
          const { data: gradesData } = await supabase
            .from('student_grades')
            .select('grade, max_grade')
            .eq('student_id', student.id)
            .eq('is_published', true);

          // Récupérer le taux de présence
          const { data: attendanceData } = await supabase
            .from('attendance_records')
            .select('status')
            .eq('student_id', student.id);

          const averageGrade = gradesData?.length ? 
            gradesData.reduce((sum, grade) => sum + (grade.grade / grade.max_grade * 20), 0) / gradesData.length : 0;

          const attendanceRate = attendanceData?.length ?
            (attendanceData.filter(record => record.status === 'present').length / attendanceData.length) * 100 : 100;

          return {
            ...student,
            averageGrade,
            attendanceRate,
            trend: Math.random() * 4 - 2, // Mock trend for now
          };
        })
      );

      setStudents(studentsWithPerformance);
    } catch (err) {
      console.error('Erreur lors de la récupération des performances:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsPerformance();
  }, []);

  return { students, loading, error, refetch: fetchStudentsPerformance };
}
