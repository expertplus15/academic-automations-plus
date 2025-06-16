
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { autoEnrollStudent, type EnrollmentResult } from '@/services/studentEnrollmentService';
import { UserFlowContext } from '@/services/userFlowService';
import { useToast } from '@/hooks/use-toast';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  birthDate: z.string().min(1, 'Date de naissance requise'),
  address: z.string().min(5, 'Adresse complète requise'),
});

const programSelectionSchema = z.object({
  departmentId: z.string().min(1, 'Département requis'),
  programId: z.string().min(1, 'Programme requis'),
  yearLevel: z.number().min(1).max(6, 'Niveau invalide'),
  specialization: z.string().optional(),
});

const registrationSchema = personalInfoSchema.merge(programSelectionSchema);

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export function useEnhancedRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentResult, setEnrollmentResult] = useState<EnrollmentResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [flowContext, setFlowContext] = useState<UserFlowContext | null>(null);
  const { toast } = useToast();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      address: '',
      departmentId: '',
      programId: '',
      yearLevel: 1,
      specialization: undefined,
    }
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startRegistration = () => {
    setStartTime(new Date());
    setCurrentStep(1);
    setEnrollmentResult(null);
    setRetryCount(0);
    setFlowContext(null);
  };

  const getElapsedTime = () => {
    if (!startTime) return 0;
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  };

  const handleFlowContextChange = (context: UserFlowContext | null) => {
    setFlowContext(context);
  };

  const canProceedToNextStep = (): boolean => {
    if (currentStep === 1 && flowContext) {
      return !flowContext.isBlocked;
    }
    return true;
  };

  const getProcessingMessage = (): string => {
    if (!flowContext) return 'Finalisation...';
    
    switch (flowContext.flowType) {
      case 'new_user':
        return 'Création du compte...';
      case 'existing_user_conversion':
        return 'Conversion du compte...';
      default:
        return 'Finalisation...';
    }
  };

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
          setRetryCount(prev => prev + 1);
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
    form,
    currentStep,
    nextStep,
    prevStep,
    startRegistration,
    getElapsedTime,
    submitRegistration,
    isSubmitting,
    startTime,
    enrollmentResult,
    retryCount,
    flowContext,
    handleFlowContextChange,
    canProceedToNextStep,
    getProcessingMessage,
  };
}
