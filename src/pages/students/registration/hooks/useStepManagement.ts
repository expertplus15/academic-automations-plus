
import { useState } from 'react';

export function useStepManagement() {
  const [currentStep, setCurrentStep] = useState(1);

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

  const getStepFields = (step: number) => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'address'] as const;
      case 2:
        return ['departmentId', 'programId', 'yearLevel'] as const;
      default:
        return [];
    }
  };

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    getStepFields,
  };
}
