
import { supabase } from '@/integrations/supabase/client';

export interface StudentEnrollmentData {
  email: string;
  fullName: string;
  programId: string;
  yearLevel: number;
}

export interface EnrollmentResult {
  success: boolean;
  student?: any;
  studentNumber?: string;
  error?: string;
}

export async function generateStudentNumber(programCode: string, year: number): Promise<string> {
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

function generateTempPassword(): string {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}

async function createUserAccount(email: string, fullName: string) {
  console.log('Starting user account creation for:', email);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: generateTempPassword(),
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        full_name: fullName,
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
  return authData.user;
}

async function ensureProfileExists(userId: string, email: string, fullName: string) {
  let profileExists = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!profileExists && attempts < maxAttempts) {
    console.log(`Checking for profile, attempt ${attempts + 1}`);
    
    const { data: profile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (profileCheckError) {
      console.error('Error checking profile:', profileCheckError);
      // Continue trying even if there's an error checking
    }

    if (profile) {
      profileExists = true;
      console.log('Profile found');
      break;
    } else {
      console.log(`Profile not found yet, attempt ${attempts + 1}. Waiting...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
  }

  if (!profileExists) {
    console.log('Profile not found after maximum attempts, creating manually');
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        role: 'student'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
    }

    console.log('Profile created manually');
  }
}

async function createStudentRecord(userId: string, studentNumber: string, programId: string, yearLevel: number) {
  console.log('Creating student record');
  
  const { data: student, error: studentError } = await supabase
    .from('students')
    .insert({
      profile_id: userId,
      student_number: studentNumber,
      program_id: programId,
      year_level: yearLevel,
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
  return student;
}

export async function autoEnrollStudent(studentData: StudentEnrollmentData): Promise<EnrollmentResult> {
  try {
    console.log('Starting auto enrollment for:', studentData.email);

    // 1. Récupérer le code du programme
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('code')
      .eq('id', studentData.programId)
      .single();

    if (programError || !program) {
      throw new Error('Programme non trouvé');
    }

    console.log('Program found:', program.code);

    // 2. Générer le numéro étudiant
    const studentNumber = await generateStudentNumber(
      program.code,
      new Date().getFullYear()
    );

    console.log('Generated student number:', studentNumber);

    // 3. Créer le compte utilisateur
    const user = await createUserAccount(studentData.email, studentData.fullName);

    // 4. S'assurer que le profil existe
    await ensureProfileExists(user.id, studentData.email, studentData.fullName);

    // 5. Créer l'enregistrement étudiant
    const student = await createStudentRecord(user.id, studentNumber, studentData.programId, studentData.yearLevel);

    console.log('Auto enrollment completed successfully');
    return { success: true, student, studentNumber };
  } catch (error) {
    console.error('Auto enrollment error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue lors de l\'inscription'
    };
  }
}
