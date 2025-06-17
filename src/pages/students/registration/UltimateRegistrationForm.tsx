
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useEnhancedRegistrationForm } from './hooks/useEnhancedRegistrationForm';
import { RegistrationProgress } from './RegistrationProgress';
import { RegistrationStartScreen } from './components/RegistrationStartScreen';
import { FormHeader } from './components/FormHeader';
import { FormContent } from './components/FormContent';
import { FormNavigation } from './components/FormNavigation';
import { useEffect, useState } from 'react';

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

  if (!startTime) {
    return <RegistrationStartScreen onStart={startRegistration} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <RegistrationProgress currentStep={currentStep} elapsedTime={elapsedTime} />
      
      <Card>
        <CardContent className="p-8">
          <FormHeader currentStep={currentStep} flowContext={flowContext} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <FormContent
                currentStep={currentStep}
                form={form}
                isSubmitting={isSubmitting}
                retryCount={retryCount}
                elapsedTime={elapsedTime}
                enrollmentResult={enrollmentResult}
                flowContext={flowContext}
                onFlowContextChange={handleFlowContextChange}
              />

              <FormNavigation
                currentStep={currentStep}
                onPrevious={prevStep}
                onNext={handleNext}
                isSubmitting={isSubmitting}
                retryCount={retryCount}
                flowContext={flowContext}
                canProceedToNextStep={canProceedToNextStep}
                getProcessingMessage={getProcessingMessage}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
