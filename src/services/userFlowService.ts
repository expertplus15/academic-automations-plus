
import { EmailCheckResult } from './emailVerificationService';
import { RegistrationFormData } from '@/pages/students/registration/useRegistrationForm';

export type UserFlowType = 'new_user' | 'existing_user_conversion' | 'existing_student';

export interface UserFlowContext {
  flowType: UserFlowType;
  emailCheckResult: EmailCheckResult;
  formData: RegistrationFormData;
  isBlocked: boolean;
  nextAction: string;
  recommendations: string[];
}

export function determineUserFlow(emailCheckResult: EmailCheckResult): UserFlowContext['flowType'] {
  if (emailCheckResult.isStudent) {
    return 'existing_student';
  }
  
  if (emailCheckResult.hasProfile) {
    return 'existing_user_conversion';
  }
  
  return 'new_user';
}

export function createUserFlowContext(
  emailCheckResult: EmailCheckResult,
  formData: RegistrationFormData
): UserFlowContext {
  const flowType = determineUserFlow(emailCheckResult);
  
  const contexts: Record<UserFlowType, Omit<UserFlowContext, 'flowType' | 'emailCheckResult' | 'formData'>> = {
    new_user: {
      isBlocked: false,
      nextAction: 'Procéder à l\'inscription',
      recommendations: [
        'Vérifiez vos informations personnelles',
        'Choisissez votre programme d\'études',
        'L\'inscription sera finalisée automatiquement'
      ]
    },
    existing_user_conversion: {
      isBlocked: false,
      nextAction: 'Convertir en compte étudiant',
      recommendations: [
        'Votre compte existant sera conservé',
        'Un numéro étudiant vous sera attribué',
        'Vous recevrez un email de confirmation'
      ]
    },
    existing_student: {
      isBlocked: true,
      nextAction: 'Se connecter avec vos identifiants',
      recommendations: [
        'Vous avez déjà un compte étudiant',
        'Utilisez vos identifiants existants',
        'Contactez l\'administration si vous avez oublié vos identifiants'
      ]
    }
  };

  return {
    flowType,
    emailCheckResult,
    formData,
    ...contexts[flowType]
  };
}

export function getFlowTitle(flowType: UserFlowType): string {
  const titles: Record<UserFlowType, string> = {
    new_user: 'Nouvelle inscription',
    existing_user_conversion: 'Conversion en compte étudiant',
    existing_student: 'Compte existant détecté'
  };
  
  return titles[flowType];
}

export function getFlowDescription(flowType: UserFlowType): string {
  const descriptions: Record<UserFlowType, string> = {
    new_user: 'Création d\'un nouveau compte étudiant avec attribution d\'un numéro étudiant.',
    existing_user_conversion: 'Conversion de votre compte existant en compte étudiant avec conservation de vos données.',
    existing_student: 'Un compte étudiant existe déjà avec cette adresse email.'
  };
  
  return descriptions[flowType];
}
