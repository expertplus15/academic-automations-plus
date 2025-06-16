
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, RegistrationFormData } from '../types';
import { useStepManagement } from './useStepManagement';
import { useRegistrationState } from './useRegistrationState';
import { useRegistrationSubmission } from './useRegistrationSubmission';

export function useEnhancedRegistrationForm() {
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    getStepFields,
  } = useStepManagement();

  const {
    startTime,
    isSubmitting,
    setIsSubmitting,
    enrollmentResult,
    setEnrollmentResult,
    retryCount,
    setRetryCount,
    flowContext,
    setFlowContext,
    startRegistration,
    getElapsedTime,
    handleFlowContextChange,
    canProceedToNextStep,
    getProcessingMessage,
  } = useRegistrationState();

  const { submitRegistration } = useRegistrationSubmission({
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
  });

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
    getStepFields,
  };
}
