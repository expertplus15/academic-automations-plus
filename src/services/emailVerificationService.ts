
import { supabase } from '@/integrations/supabase/client';

export interface EmailCheckResult {
  exists: boolean;
  hasProfile: boolean;
  isStudent: boolean;
  profileData?: {
    id: string;
    full_name: string;
    role: string;
  };
}

export async function checkEmailExists(email: string): Promise<EmailCheckResult> {
  try {
    console.log('Checking if email exists:', email);
    
    // Vérifier si un profil existe avec cet email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profile:', profileError);
      return { exists: false, hasProfile: false, isStudent: false };
    }

    if (profile) {
      console.log('Profile found:', profile);
      
      // Vérifier si c'est déjà un étudiant
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, student_number')
        .eq('profile_id', profile.id)
        .maybeSingle();

      return {
        exists: true,
        hasProfile: true,
        isStudent: !studentError && !!student,
        profileData: profile
      };
    }

    return { exists: false, hasProfile: false, isStudent: false };
  } catch (error) {
    console.error('Error in checkEmailExists:', error);
    return { exists: false, hasProfile: false, isStudent: false };
  }
}

export function getEmailErrorMessage(checkResult: EmailCheckResult): string {
  if (checkResult.isStudent) {
    return 'Ce compte étudiant existe déjà. Veuillez vous connecter avec vos identifiants.';
  }
  
  if (checkResult.hasProfile) {
    return 'Un compte existe déjà avec cette adresse email. Veuillez vous connecter ou utiliser une autre adresse.';
  }
  
  return 'Cette adresse email est disponible pour l\'inscription.';
}
