
import { supabase } from '@/integrations/supabase/client';
import { checkEmailExists } from './emailVerificationService';

export interface OptimizedEnrollmentData {
  email: string;
  fullName: string;
  programId: string;
  yearLevel: number;
  phone?: string;
  birthDate?: string;
  address?: string;
}

export interface OptimizedEnrollmentResult {
  success: boolean;
  student?: any;
  studentNumber?: string;
  error?: string;
  isExistingUser?: boolean;
  processingTime?: number;
}

async function generateOptimizedStudentNumber(programCode: string, year: number): Promise<string> {
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase.rpc('generate_student_number', {
      program_code: programCode,
      enrollment_year: year
    });

    if (error) {
      console.warn('RPC failed, using fallback:', error);
      return `${programCode}${year.toString().slice(-2)}001`;
    }

    const endTime = performance.now();
    console.log(`Student number generation: ${endTime - startTime}ms`);
    
    return data;
  } catch (error) {
    console.error('Error generating student number:', error);
    return `${programCode}${year.toString().slice(-2)}001`;
  }
}

async function createOptimizedUserAccount(email: string, fullName: string) {
  const startTime = performance.now();
  
  const tempPassword = Math.random().toString(36).slice(-12) + 
                      Math.random().toString(36).slice(-12);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: tempPassword,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        full_name: fullName,
        role: 'student'
      }
    }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      throw new Error('EXISTING_USER');
    }
    throw authError;
  }

  if (!authData.user) {
    throw new Error('Aucun utilisateur créé');
  }

  const endTime = performance.now();
  console.log(`User account creation: ${endTime - startTime}ms`);
  
  return authData.user;
}

async function waitForOptimizedProfile(userId: string, email: string, fullName: string) {
  const startTime = performance.now();
  let attempts = 0;
  const maxAttempts = 8;
  const delayMs = 1000;

  while (attempts < maxAttempts) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!error && profile) {
        const endTime = performance.now();
        console.log(`Profile creation wait: ${endTime - startTime}ms`);
        return;
      }
    } catch (error) {
      console.warn(`Profile check attempt ${attempts + 1} failed:`, error);
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));
    attempts++;
  }

  // Manual profile creation as fallback
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      full_name: fullName,
      role: 'student'
    });

  if (profileError) {
    throw new Error(`Erreur création profil: ${profileError.message}`);
  }
}

async function createOptimizedStudentRecord(
  userId: string, 
  studentNumber: string, 
  programId: string, 
  yearLevel: number,
  additionalData?: Partial<OptimizedEnrollmentData>
) {
  const startTime = performance.now();
  
  const studentData = {
    profile_id: userId,
    student_number: studentNumber,
    program_id: programId,
    year_level: yearLevel,
    status: 'active',
    enrollment_date: new Date().toISOString(),
    ...(additionalData?.phone && { phone: additionalData.phone }),
    ...(additionalData?.birthDate && { birth_date: additionalData.birthDate }),
    ...(additionalData?.address && { address: additionalData.address })
  };

  const { data: student, error } = await supabase
    .from('students')
    .insert(studentData)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur création étudiant: ${error.message}`);
  }

  const endTime = performance.now();
  console.log(`Student record creation: ${endTime - startTime}ms`);
  
  return student;
}

export async function optimizedStudentEnrollment(
  studentData: OptimizedEnrollmentData
): Promise<OptimizedEnrollmentResult> {
  const overallStartTime = performance.now();
  
  try {
    console.log('🚀 Starting optimized enrollment for:', studentData.email);

    // Phase 1: Email verification (parallel with program fetch)
    const [emailCheckResult, programData] = await Promise.all([
      checkEmailExists(studentData.email),
      supabase
        .from('programs')
        .select('code')
        .eq('id', studentData.programId)
        .single()
    ]);

    if (programData.error || !programData.data) {
      return {
        success: false,
        error: 'Programme non trouvé',
        processingTime: performance.now() - overallStartTime
      };
    }

    // Handle existing student
    if (emailCheckResult.isStudent) {
      return {
        success: false,
        error: 'Ce compte étudiant existe déjà. Veuillez vous connecter.',
        isExistingUser: true,
        processingTime: performance.now() - overallStartTime
      };
    }

    // Handle existing user (non-student)
    if (emailCheckResult.hasProfile && emailCheckResult.profileData) {
      const studentNumber = await generateOptimizedStudentNumber(
        programData.data.code,
        new Date().getFullYear()
      );

      const student = await createOptimizedStudentRecord(
        emailCheckResult.profileData.id,
        studentNumber,
        studentData.programId,
        studentData.yearLevel,
        studentData
      );

      return { 
        success: true, 
        student, 
        studentNumber,
        isExistingUser: true,
        processingTime: performance.now() - overallStartTime
      };
    }

    // New user flow - optimized parallel processing
    const studentNumber = await generateOptimizedStudentNumber(
      programData.data.code,
      new Date().getFullYear()
    );

    const user = await createOptimizedUserAccount(
      studentData.email, 
      studentData.fullName
    );

    await waitForOptimizedProfile(user.id, studentData.email, studentData.fullName);

    const student = await createOptimizedStudentRecord(
      user.id, 
      studentNumber, 
      studentData.programId, 
      studentData.yearLevel,
      studentData
    );

    const totalTime = performance.now() - overallStartTime;
    console.log(`✅ Optimized enrollment completed in ${totalTime.toFixed(2)}ms`);

    return { 
      success: true, 
      student, 
      studentNumber,
      isExistingUser: false,
      processingTime: totalTime
    };
  } catch (error) {
    const totalTime = performance.now() - overallStartTime;
    console.error('❌ Optimized enrollment error:', error);
    
    let errorMessage = 'Une erreur inconnue est survenue';
    let isExistingUser = false;
    
    if (error instanceof Error) {
      if (error.message === 'EXISTING_USER') {
        errorMessage = 'Un compte avec cette adresse existe déjà.';
        isExistingUser = true;
      } else {
        errorMessage = error.message;
      }
    }
    
    return { 
      success: false, 
      error: errorMessage,
      isExistingUser,
      processingTime: totalTime
    };
  }
}
