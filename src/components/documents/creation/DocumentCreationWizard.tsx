import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, FileText, Users, Settings, Send } from 'lucide-react';
import { TemplateSelector } from './wizard/TemplateSelector';
import { DataConfiguration } from './wizard/DataConfiguration';
import { PreviewGeneration } from './wizard/PreviewGeneration';
import { ApprovalSettings } from './wizard/ApprovalSettings';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  isCompleted: boolean;
  isOptional?: boolean;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'template',
    title: 'Sélection du template',
    description: 'Choisissez le modèle de document à générer',
    icon: FileText,
    component: TemplateSelector,
    isCompleted: false,
  },
  {
    id: 'data',
    title: 'Configuration des données',
    description: 'Sélectionnez les étudiants et paramètres',
    icon: Users,
    component: DataConfiguration,
    isCompleted: false,
  },
  {
    id: 'preview',
    title: 'Aperçu et validation',
    description: 'Vérifiez le résultat avant génération',
    icon: Settings,
    component: PreviewGeneration,
    isCompleted: false,
  },
  {
    id: 'approval',
    title: 'Approbation',
    description: 'Configurez le processus d\'approbation',
    icon: Send,
    component: ApprovalSettings,
    isCompleted: false,
    isOptional: true,
  },
];

export function DocumentCreationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    template: null,
    students: [],
    parameters: {},
    approvalSettings: null,
  });
  const [steps, setSteps] = useState(WIZARD_STEPS);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateStepCompletion = (stepIndex: number, isCompleted: boolean) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, isCompleted } : step
    ));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      updateStepCompletion(currentStep, true);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Permettre la navigation uniquement vers les étapes précédentes ou la suivante
    if (stepIndex <= currentStep + 1 && stepIndex >= 0) {
      setCurrentStep(stepIndex);
    }
  };

  const canProceed = () => {
    // Logique de validation selon l'étape
    switch (currentStep) {
      case 0: return wizardData.template !== null;
      case 1: return wizardData.students.length > 0;
      case 2: return true; // Preview est toujours valide
      case 3: return true; // Approbation optionnelle
      default: return false;
    }
  };

  const handleFinish = async () => {
    // Logique de génération finale
    console.log('Génération finale avec:', wizardData);
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header avec progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assistant de création de documents</h1>
            <p className="text-muted-foreground">
              Créez vos documents en quelques étapes simples avec notre assistant guidé
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Étape {currentStep + 1} sur {steps.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Navigation par étapes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = step.isCompleted;
              const isAccessible = index <= currentStep + 1;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isAccessible}
                    className={`
                      flex flex-col items-center space-y-2 p-3 rounded-lg transition-all
                      ${isActive ? 'bg-primary/10 text-primary' : ''}
                      ${isCompleted ? 'text-green-600' : ''}
                      ${!isAccessible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${isActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'}
                        `}>
                          {isActive && <Circle className="w-3 h-3 fill-current" />}
                        </div>
                      )}
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{step.title}</div>
                      {step.isOptional && (
                        <div className="text-xs text-muted-foreground">(Optionnel)</div>
                      )}
                    </div>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className="w-12 h-px bg-border mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contenu de l'étape courante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <currentStepData.icon className="w-5 h-5" />
            <span>{currentStepData.title}</span>
          </CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>
        <CardContent>
          <currentStepData.component 
            data={wizardData}
            onDataChange={setWizardData}
          />
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Précédent</span>
        </Button>

        <div className="flex items-center space-x-2">
          {!isLastStep ? (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleFinish}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Générer les documents</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}