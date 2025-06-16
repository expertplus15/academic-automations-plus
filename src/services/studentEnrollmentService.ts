
import { supabase } from '@/integrations/supabase/client';
import { checkEmailExists, type EmailCheckResult } from './emailVerificationService';

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
  isExistingUser?: boolean;
  emailCheckResult?: EmailCheckResult;
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
    
    // Gérer spécifiquement l'erreur d'utilisateur déjà existant
    if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
      throw new Error('EXISTING_USER');
    }
    
    throw authError;
  }

  if (!authData.user) {
    throw new Error('Aucun utilisateur créé');
  }

  console.log('User created:', authData.user.id);
  return authData.user;
}

async function waitForProfileCreation(userId: string, email: string, fullName: string) {
  console.log('Waiting for profile creation via trigger...');
  
  let profileExists = false;
  let attempts = 0;
  const maxAttempts = 10; // Réduire les tentatives
  const delayMs = 1500; // Réduire le délai

  while (!profileExists && attempts < maxAttempts) {
    console.log(`Checking for profile, attempt ${attempts + 1}/${maxAttempts}`);
    
    try {
      const { data: profile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError);
      } else if (profile) {
        profileExists = true;
        console.log('Profile found via trigger');
        break;
      }
    } catch (error) {
      console.error('Exception while checking profile:', error);
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));
    attempts++;
  }

  if (!profileExists) {
    console.log('Profile not found after maximum attempts, attempting manual creation');
    
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: fullName,
          role: 'student'
        });

      if (profileError) {
        if (profileError.message.includes('foreign key constraint')) {
          throw new Error('L\'utilisateur n\'est pas encore complètement créé. Veuillez réessayer dans quelques instants.');
        }
        throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
      }

      console.log('Profile created manually');
    } catch (error) {
      console.error('Failed to create profile manually:', error);
      throw error;
    }
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

    // Phase 1: Vérifier si l'email existe déjà
    const emailCheckResult = await checkEmailExists(studentData.email);
    console.log('Email check result:', emailCheckResult);

    // Si l'utilisateur existe déjà comme étudiant, retourner une erreur spécifique
    if (emailCheckResult.isStudent) {
      return {
        success: false,
        error: 'Ce compte étudiant existe déjà. Veuillez vous connecter avec vos identifiants.',
        isExistingUser: true,
        emailCheckResult
      };
    }

    // Si l'utilisateur existe mais n'est pas étudiant, on peut le convertir
    if (emailCheckResult.hasProfile && emailCheckResult.profileData) {
      console.log('Converting existing user to student');
      
      // Récupérer le code du programme
      const { data: program, error: programError } = await supabase
        .from('programs')
        .select('code')
        .eq('id', studentData.programId)
        .single();

      if (programError || !program) {
        throw new Error('Programme non trouvé');
      }

      // Générer le numéro étudiant
      const studentNumber = await generateStudentNumber(
        program.code,
        new Date().getFullYear()
      );

      // Créer l'enregistrement étudiant
      const student = await createStudentRecord(
        emailCheckResult.profileData.id,
        studentNumber,
        studentData.programId,
        studentData.yearLevel
      );

      return { 
        success: true, 
        student, 
        studentNumber,
        isExistingUser: true,
        emailCheckResult
      };
    }

    // Nouvel utilisateur - processus complet
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

    // 4. Attendre que le profil soit créé
    await waitForProfileCreation(user.id, studentData.email, studentData.fullName);

    // 5. Créer l'enregistrement étudiant
    const student = await createStudentRecord(user.id, studentNumber, studentData.programId, studentData.yearLevel);

    console.log('Auto enrollment completed successfully');
    return { 
      success: true, 
      student, 
      studentNumber,
      isExistingUser: false,
      emailCheckResult
    };
  } catch (error) {
    console.error('Auto enrollment error:', error);
    
    let errorMessage = 'Une erreur inconnue est survenue lors de l\'inscription';
    let isExistingUser = false;
    
    if (error instanceof Error) {
      if (error.message === 'EXISTING_USER') {
        errorMessage = 'Un compte avec cette adresse email existe déjà. Veuillez vous connecter ou utiliser une autre adresse.';
        isExistingUser = true;
      } else if (error.message.includes('foreign key constraint')) {
        errorMessage = 'Problème de synchronisation lors de la création du compte. Veuillez réessayer dans quelques instants.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return { 
      success: false, 
      error: errorMessage,
      isExistingUser
    };
  }
}
