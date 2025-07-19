import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  student_number: string;
  status: string;
  year_level: number;
  enrollment_date: string;
  created_at: string;
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

      // Requête de base sans les nouveaux champs pour éviter les erreurs de types
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          status,
          year_level,
          enrollment_date,
          created_at,
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

      if (error) {
        console.error('Erreur lors de la récupération des étudiants:', error);
        setError(error.message);
      } else {
        // Enrichir les données avec des champs vides pour first_name et last_name
        const enrichedData = (data || []).map((student: any) => ({
          ...student,
          academic_year_id: undefined, // Sera ajouté une fois les types mis à jour
          profiles: {
            ...student.profiles,
            first_name: undefined,
            last_name: undefined
          }
        }));
        
        setStudents(enrichedData);
      }
    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [academicYearId]);

  const refetch = () => {
    fetchStudents();
  };

  return { students, loading, error, refetch };
}