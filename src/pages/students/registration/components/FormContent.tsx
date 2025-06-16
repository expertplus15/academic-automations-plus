
import { EnhancedPersonalInfoStep } from '../EnhancedPersonalInfoStep';
import { ProgramSelectionStep } from '../ProgramSelectionStep';
import { DocumentsStep } from '../DocumentsStep';
import { ValidationStep } from '../ValidationStep';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from '../types';
import { UserFlowContext } from '@/services/userFlowService';

interface FormContentProps {
  currentStep: number;
  form: UseFormReturn<RegistrationFormData>;
  isSubmitting: boolean;
  retryCount: number;
  elapsedTime: number;
  enrollmentResult?: { success?: boolean; studentNumber?: string } | null;
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
  onFlowContextChange,
}: FormContentProps) {
  switch (currentStep) {
    case 1:
      return (
        <EnhancedPersonalInfoStep 
          form={form} 
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
