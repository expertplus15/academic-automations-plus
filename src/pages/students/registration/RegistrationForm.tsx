
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useRegistrationForm } from './useRegistrationForm';
import { RegistrationProgress } from './RegistrationProgress';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ProgramSelectionStep } from './ProgramSelectionStep';
import { DocumentsStep } from './DocumentsStep';
import { ValidationStep } from './ValidationStep';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

export function RegistrationForm() {
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
    emailCheckResult,
    isExistingUser,
  } = useRegistrationForm();

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

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      // Vérifier si l'email indique un compte étudiant existant
      if (currentStep === 1 && emailCheckResult?.isStudent) {
        return; // Bloquer la progression si c'est déjà un étudiant
      }
      
      if (currentStep === 3) {
        // Submit the form on step 3 (documents step)
        const formData = form.getValues();
        await submitRegistration(formData);
      } else {
        nextStep();
      }
    }
  };

  // Create a proper wrapper function for form submission
  const handleFormSubmit = async (data: any) => {
    await submitRegistration(data, false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} />;
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
            isExistingUser={isExistingUser}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informations personnelles';
      case 2: return 'Choix du programme';
      case 3: return 'Documents';
      case 4: return isExistingUser ? 'Conversion validée' : 'Inscription validée';
      default: return '';
    }
  };

  if (!startTime) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Inscription Automatisée</h2>
          <p className="text-muted-foreground mb-6">
            Complétez votre inscription en moins de 30 secondes grâce à notre processus automatisé.
          </p>
          <Button onClick={startRegistration} size="lg" className="bg-students hover:bg-students/90">
            Commencer l'inscription
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <RegistrationProgress currentStep={currentStep} elapsedTime={elapsedTime} />
      
      <Card>
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
            {isExistingUser && currentStep < 4 && (
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Compte existant détecté. Nous allons convertir votre compte en compte étudiant.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              {renderStepContent()}

              {currentStep < 4 && (
                <div className="flex justify-between pt-6">
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
                    disabled={isSubmitting || (emailCheckResult?.isStudent && currentStep === 1)}
                    className="bg-students hover:bg-students/90"
                  >
                    {currentStep === 3 ? (
                      isSubmitting ? (
                        retryCount > 0 ? `Tentative ${retryCount}...` : (isExistingUser ? 'Conversion...' : 'Finalisation...')
                      ) : (isExistingUser ? 'Finaliser la conversion' : 'Finaliser l\'inscription')
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
