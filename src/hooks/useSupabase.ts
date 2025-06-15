
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Tables = {
  profiles: any;
  students: any;
  programs: any;
  subjects: any;
  departments: any;
  academic_levels: any;
  class_groups: any;
  specializations: any;
  rooms: any;
};

export function useTable<T extends keyof Tables>(
  tableName: T,
  select = '*',
  filters?: any
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(tableName).select(select);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key as any, value);
        });
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setData(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, select, JSON.stringify(filters)]);

  return { data, loading, error, refetch: fetchData };
}

// Hook spécialisé pour les étudiants
export function useStudents() {
  return useTable('students', `
    *,
    profiles!students_profile_id_fkey(*),
    programs!students_program_id_fkey(*)
  `);
}

// Hook spécialisé pour les programmes
export function usePrograms() {
  return useTable('programs', `
    *,
    departments!programs_department_id_fkey(*)
  `);
}

// Hook spécialisé pour les départements
export function useDepartments() {
  return useTable('departments');
}

// Hook spécialisé pour les matières
export function useSubjects() {
  return useTable('subjects');
}

// Hook spécialisé pour les filières/spécialisations
export function useSpecializations() {
  return useTable('specializations', `
    *,
    programs!specializations_program_id_fkey(*)
  `);
}

// Hook spécialisé pour les niveaux d'études
export function useAcademicLevels() {
  return useTable('academic_levels');
}

// Utilitaires pour inscription automatisée
export async function generateStudentNumber(programCode: string, year: number) {
  const { data, error } = await supabase.rpc('generate_student_number', {
    program_code: programCode,
    enrollment_year: year
  });

  if (error) {
    console.error('Error generating student number:', error);
    return `${programCode}${year.toString().slice(-2)}001`;
  }

  return data;
}

export async function autoEnrollStudent(studentData: {
  email: string;
  fullName: string;
  programId: string;
  yearLevel: number;
}) {
  try {
    // 1. Récupérer le code du programme
    const { data: program } = await supabase
      .from('programs')
      .select('code')
      .eq('id', studentData.programId)
      .single();

    // 2. Générer le numéro étudiant
    const studentNumber = await generateStudentNumber(
      program?.code || 'STD',
      new Date().getFullYear()
    );

    // 3. Créer l'utilisateur avec signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: studentData.email,
      password: generateTempPassword(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: studentData.fullName,
          role: 'student'
        }
      }
    });

    if (authError) throw authError;

    // 4. Créer l'enregistrement étudiant (sera fait automatiquement par le trigger)
    // Le profil sera créé automatiquement par le trigger handle_new_user
    
    // 5. Créer l'enregistrement étudiant spécifique
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        profile_id: authData.user!.id,
        student_number: studentNumber,
        program_id: studentData.programId,
        year_level: studentData.yearLevel,
        status: 'active',
        enrollment_date: new Date().toISOString()
      })
      .select()
      .single();

    if (studentError) throw studentError;

    return { success: true, student, studentNumber };
  } catch (error) {
    console.error('Auto enrollment error:', error);
    return { success: false, error };
  }
}

function generateTempPassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}
