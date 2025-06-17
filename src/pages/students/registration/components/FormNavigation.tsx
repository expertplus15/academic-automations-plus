
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { UserFlowContext } from '@/services/userFlowService';

interface FormNavigationProps {
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  retryCount: number;
  flowContext: UserFlowContext | null;
  canProceedToNextStep: (step: number) => boolean;
  getProcessingMessage: () => string;
}

export function FormNavigation({
  currentStep,
  onPrevious,
  onNext,
  isSubmitting,
  retryCount,
  flowContext,
  canProceedToNextStep,
  getProcessingMessage
}: FormNavigationProps) {
  if (currentStep >= 4) return null;

  return (
    <div className="flex justify-between pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Précédent
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting || !canProceedToNextStep(currentStep)}
        className="bg-students hover:bg-students/90"
      >
        {currentStep === 3 ? (
          isSubmitting ? (
            retryCount > 0 ? `Tentative ${retryCount}...` : getProcessingMessage()
          ) : (
            flowContext?.flowType === 'existing_user_conversion' ? 'Finaliser la conversion' : 'Finaliser l\'inscription'
          )
        ) : (
          <>
            Suivant
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
