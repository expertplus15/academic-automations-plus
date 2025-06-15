
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
  campuses: any;
  sites: any;
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
    console.log('Starting auto enrollment for:', studentData.email);

    // 1. Récupérer le code du programme
    const { data: program } = await supabase
      .from('programs')
      .select('code')
      .eq('id', studentData.programId)
      .single();

    if (!program) {
      throw new Error('Programme non trouvé');
    }

    // 2. Générer le numéro étudiant
    const studentNumber = await generateStudentNumber(
      program.code,
      new Date().getFullYear()
    );

    console.log('Generated student number:', studentNumber);

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

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Aucun utilisateur créé');
    }

    console.log('User created:', authData.user.id);

    // 4. Attendre que l'utilisateur soit confirmé et que le profil soit créé
    // Vérifier d'abord si l'utilisateur existe vraiment dans auth.users
    const { data: authUser } = await supabase.auth.getUser();
    console.log('Current auth user:', authUser);

    // 5. Attendre que le trigger crée le profil ou le créer nous-mêmes
    let profileExists = false;
    let attempts = 0;
    const maxAttempts = 15; // Augmenter le nombre de tentatives

    while (!profileExists && attempts < maxAttempts) {
      console.log(`Checking for profile, attempt ${attempts + 1}`);
      
      const { data: profile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle(); // Utiliser maybeSingle au lieu de single

      if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError);
      }

      if (profile) {
        profileExists = true;
        console.log('Profile found');
        break;
      } else {
        console.log(`Profile not found yet, attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
        attempts++;
      }
    }

    // Si le profil n'existe toujours pas, essayer de le créer
    if (!profileExists) {
      console.log('Creating profile manually');
      
      // D'abord, vérifier que l'utilisateur existe dans auth.users
      const { data: userData } = await supabase.auth.admin.getUserById(authData.user.id);
      
      if (!userData.user) {
        throw new Error('Utilisateur non trouvé dans la base de données d\'authentification');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: studentData.email,
          full_name: studentData.fullName,
          role: 'student'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
      }

      console.log('Profile created manually');
    }

    // 6. Créer l'enregistrement étudiant
    console.log('Creating student record');
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        profile_id: authData.user.id,
        student_number: studentNumber,
        program_id: studentData.programId,
        year_level: studentData.yearLevel,
        status: 'active',
        enrollment_date: new Date().toISOString()
      })
      .select()
      .single();

    if (studentError) {
      console.error('Student creation error:', studentError);
      throw new Error(`Erreur lors de la création de l'étudiant: ${studentError.message}`);
    }

    console.log('Student created successfully:', student);

    return { success: true, student, studentNumber };
  } catch (error) {
    console.error('Auto enrollment error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
    };
  }
}

function generateTempPassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}
