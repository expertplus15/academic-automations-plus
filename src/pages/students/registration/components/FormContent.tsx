
import { UseFormReturn } from 'react-hook-form';
import { AdaptivePersonalInfoStep } from '../AdaptivePersonalInfoStep';
import { ProgramSelectionStep } from '../ProgramSelectionStep';
import { DocumentsStep } from '../DocumentsStep';
import { ValidationStep } from '../ValidationStep';
import { UserFlowContext } from '@/services/userFlowService';
import { RegistrationFormData } from '../types';
import { EnrollmentResult } from '@/services/studentEnrollmentService';

interface FormContentProps {
  currentStep: number;
  form: UseFormReturn<RegistrationFormData>;
  isSubmitting: boolean;
  retryCount: number;
  elapsedTime: number;
  enrollmentResult: EnrollmentResult | null;
  flowContext: UserFlowContext | null;
  onFlowContextChange: (context: UserFlowContext | null) => void;
}

export function FormContent({
  currentStep,
  form,
  isSubmitting,
  retryCount,
  elapsedTime,
  enrollmentResult,
  flowContext,
  onFlowContextChange
}: FormContentProps) {
  switch (currentStep) {
    case 1:
      return (
        <AdaptivePersonalInfoStep 
          form={form} 
          flowContext={flowContext}
          onFlowContextChange={onFlowContextChange}
        />
      );
    case 2:
      return <ProgramSelectionStep form={form} />;
    case 3:
      return <DocumentsStep isSubmitting={isSubmitting} retryCount={retryCount} />;
    case 4:
      return (
        <ValidationStep
          formData={form.getValues()}
          elapsedTime={elapsedTime}
          studentNumber={enrollmentResult?.studentNumber}
          isSuccess={enrollmentResult?.success}
          isExistingUser={flowContext?.flowType === 'existing_user_conversion'}
        />
      );
    default:
      return null;
  }
}
