
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { UserFlowContext } from '@/services/userFlowService';
import { getFlowTitle, getFlowDescription } from '@/services/userFlowService';

interface FormHeaderProps {
  currentStep: number;
  flowContext: UserFlowContext | null;
}

export function FormHeader({ currentStep, flowContext }: FormHeaderProps) {
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: 
        return flowContext ? getFlowTitle(flowContext.flowType) : 'Informations personnelles';
      case 2: 
        return 'Choix du programme';
      case 3: 
        return 'Finalisation';
      case 4: 
        return flowContext?.flowType === 'existing_user_conversion' ? 'Conversion validée' : 'Inscription validée';
      default: 
        return '';
    }
  };

  const getStepDescription = () => {
    if (currentStep === 1 && flowContext) {
      return getFlowDescription(flowContext.flowType);
    }
    return null;
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
      {getStepDescription() && (
        <p className="text-sm text-muted-foreground mt-1">{getStepDescription()}</p>
      )}
      
      {flowContext && flowContext.flowType === 'existing_user_conversion' && currentStep < 4 && (
        <Alert className="mt-4 border-blue-200 bg-blue-50">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            🔄 Processus de conversion accéléré - Certains champs sont pré-remplis automatiquement.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
