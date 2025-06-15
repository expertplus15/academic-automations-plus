
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { autoEnrollStudent } from '@/hooks/useSupabase';
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
      specialization: '',
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
  };

  const getElapsedTime = () => {
    if (!startTime) return 0;
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  };

  const submitRegistration = async (data: RegistrationFormData) => {
    if (!startTime) return;

    setIsSubmitting(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      const result = await autoEnrollStudent({
        email: data.email,
        fullName,
        programId: data.programId,
        yearLevel: data.yearLevel,
      });

      if (result.success) {
        const elapsedTime = getElapsedTime();
        toast({
          title: "Inscription réussie!",
          description: `Numéro étudiant: ${result.studentNumber} (${elapsedTime}s)`,
        });
        setCurrentStep(4); // Success step
      } else {
        throw new Error('Erreur lors de l\'inscription');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
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
  };
}
