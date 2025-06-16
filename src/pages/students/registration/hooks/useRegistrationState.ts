
import { useState } from 'react';
import { EnrollmentResult } from '@/services/studentEnrollmentService';
import { UserFlowContext } from '@/services/userFlowService';

export function useRegistrationState() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentResult, setEnrollmentResult] = useState<EnrollmentResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [flowContext, setFlowContext] = useState<UserFlowContext | null>(null);

  const startRegistration = () => {
    setStartTime(new Date());
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

  const canProceedToNextStep = (currentStep: number): boolean => {
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

  return {
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
  };
}
