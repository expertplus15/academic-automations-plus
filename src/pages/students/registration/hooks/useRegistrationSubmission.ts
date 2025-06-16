
import { useToast } from '@/hooks/use-toast';
import { autoEnrollStudent } from '@/services/studentEnrollmentService';
import { RegistrationFormData } from '../types';
import { UserFlowContext } from '@/services/userFlowService';

interface UseRegistrationSubmissionProps {
  startTime: Date | null;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  retryCount: number;
  setRetryCount: (value: number) => void;
  setEnrollmentResult: (result: any) => void;
  setCurrentStep: (step: number) => void;
  flowContext: UserFlowContext | null;
  getElapsedTime: () => number;
  getProcessingMessage: () => string;
}

export function useRegistrationSubmission({
  startTime,
  isSubmitting,
  setIsSubmitting,
  retryCount,
  setRetryCount,
  setEnrollmentResult,
  setCurrentStep,
  flowContext,
  getElapsedTime,
  getProcessingMessage,
}: UseRegistrationSubmissionProps) {
  const { toast } = useToast();

  const submitRegistration = async (data: RegistrationFormData, isRetry = false) => {
    if (!startTime) return;

    console.log('Starting registration submission:', data);
    setIsSubmitting(true);
    
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      
      if (!isRetry) {
        toast({
          title: flowContext?.flowType === 'existing_user_conversion' ? "Conversion en cours..." : "Inscription en cours...",
          description: getProcessingMessage(),
        });
      } else {
        toast({
          title: "Nouvelle tentative...",
          description: `Tentative ${retryCount + 1} de création du compte`,
        });
      }

      const result = await autoEnrollStudent({
        email: data.email,
        fullName,
        programId: data.programId,
        yearLevel: data.yearLevel,
      });

      if (result.success && result.studentNumber) {
        setEnrollmentResult(result);
        const elapsedTime = getElapsedTime();
        
        toast({
          title: result.isExistingUser ? "Conversion réussie!" : "Inscription réussie!",
          description: `Numéro étudiant: ${result.studentNumber} (${elapsedTime}s)`,
        });
        
        setCurrentStep(4);
        setRetryCount(0);
      } else {
        console.error('Registration failed:', result.error);
        
        if (result.isExistingUser && result.emailCheckResult?.isStudent) {
          toast({
            title: "Compte étudiant existant",
            description: "Ce compte étudiant existe déjà. Veuillez vous connecter.",
            variant: "destructive",
          });
          return;
        }
        
        if (result.error?.includes('synchronisation') && retryCount < 2) {
          setRetryCount(retryCount + 1);
          toast({
            title: "Synchronisation en cours...",
            description: "Nouvelle tentative dans 3 secondes",
          });
          
          setTimeout(() => {
            submitRegistration(data, true);
          }, 3000);
          return;
        }
        
        toast({
          title: "Erreur d'inscription",
          description: result.error || "Une erreur est survenue lors de l'inscription",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration submission error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitRegistration,
  };
}
