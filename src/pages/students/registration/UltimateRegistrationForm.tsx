
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useEnhancedRegistrationForm } from './hooks/useEnhancedRegistrationForm';
import { ProgressIndicator } from './ProgressIndicator';
import { AdaptivePersonalInfoStep } from './AdaptivePersonalInfoStep';
import { ProgramSelectionStep } from './ProgramSelectionStep';
import { DocumentsStep } from './DocumentsStep';
import { ValidationStep } from './ValidationStep';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { getFlowTitle, getFlowDescription } from '@/services/userFlowService';

export function UltimateRegistrationForm() {
  const {
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
  } = useEnhancedRegistrationForm();

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setElapsedTime(getElapsedTime());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, getElapsedTime]);

  const validateCurrentStep = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    if (!canProceedToNextStep(currentStep)) {
      return;
    }
    
    if (currentStep === 3) {
      const formData = form.getValues();
      await submitRegistration(formData);
    } else {
      nextStep();
    }
  };

  const handleFormSubmit = async (data: any) => {
    await submitRegistration(data, false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AdaptivePersonalInfoStep 
            form={form} 
            flowContext={flowContext}
            onFlowContextChange={handleFlowContextChange}
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
  };

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

  if (!startTime) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Inscription Intelligente</h2>
          <p className="text-muted-foreground mb-6">
            Système d'inscription automatisé avec détection de comptes existants et validation en temps réel.
          </p>
          <div className="text-sm text-muted-foreground mb-6">
            ✨ Validation instantanée<br/>
            🔄 Conversion automatique de comptes<br/>
            ⚡ Processus ultra-rapide (moins de 30 secondes)
          </div>
          <Button onClick={startRegistration} size="lg" className="bg-students hover:bg-students/90">
            Commencer l'inscription
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={4}
        elapsedTime={elapsedTime}
        isBlocked={flowContext?.isBlocked}
        flowType={flowContext?.flowType}
      />
      
      <Card>
        <CardContent className="p-8">
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              {renderStepContent()}

              {currentStep < 4 && (
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
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
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
