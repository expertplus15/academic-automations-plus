
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { autoEnrollStudent, type EnrollmentResult } from '@/services/studentEnrollmentService';
import { checkEmailExists } from '@/services/emailVerificationService';
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

export function useRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentResult, setEnrollmentResult] = useState<EnrollmentResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [emailCheckResult, setEmailCheckResult] = useState<any>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
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
    setEmailCheckResult(null);
    setIsExistingUser(false);
  };

  const getElapsedTime = () => {
    if (!startTime) return 0;
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  };

  const checkEmail = async (email: string) => {
    try {
      const result = await checkEmailExists(email);
      setEmailCheckResult(result);
      setIsExistingUser(result.exists);
      
      if (result.isStudent) {
        toast({
          title: "Compte existant détecté",
          description: "Ce compte étudiant existe déjà. Vous pouvez vous connecter.",
          variant: "destructive",
        });
      } else if (result.hasProfile) {
        toast({
          title: "Compte existant détecté",
          description: "Un compte existe avec cet email. Il sera converti en compte étudiant.",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error checking email:', error);
      return null;
    }
  };

  const submitRegistration = async (data: RegistrationFormData, isRetry = false) => {
    if (!startTime) return;

    console.log('Starting registration submission:', data);
    setIsSubmitting(true);
    
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      
      if (!isRetry) {
        if (isExistingUser) {
          toast({
            title: "Conversion en cours...",
            description: "Conversion du compte existant en compte étudiant",
          });
        } else {
          toast({
            title: "Inscription en cours...",
            description: "Création de votre compte étudiant",
          });
        }
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
        
        if (result.isExistingUser) {
          toast({
            title: "Conversion réussie!",
            description: `Compte converti - Numéro étudiant: ${result.studentNumber} (${elapsedTime}s)`,
          });
        } else {
          toast({
            title: "Inscription réussie!",
            description: `Numéro étudiant: ${result.studentNumber} (${elapsedTime}s)`,
          });
        }
        
        setCurrentStep(4); // Success step
        setRetryCount(0);
      } else {
        console.error('Registration failed:', result.error);
        
        // Gérer les cas d'utilisateur existant
        if (result.isExistingUser && result.emailCheckResult?.isStudent) {
          toast({
            title: "Compte étudiant existant",
            description: "Ce compte étudiant existe déjà. Veuillez vous connecter.",
            variant: "destructive",
          });
          return;
        }
        
        // Si c'est un problème de synchronisation et qu'on n'a pas encore essayé de retry
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
    checkEmail,
    isSubmitting,
    startTime,
    enrollmentResult,
    retryCount,
    emailCheckResult,
    isExistingUser,
  };
}
