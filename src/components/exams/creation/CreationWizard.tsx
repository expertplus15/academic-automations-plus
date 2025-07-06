import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepIndicator } from './StepIndicator';
import { BasicInfo } from '../../../pages/exams/creation/BasicInfo';
import { Configuration } from '../../../pages/exams/creation/Configuration';
import { Scheduling } from '../../../pages/exams/creation/Scheduling';
import { Review } from '../../../pages/exams/creation/Review';
import { useExamCreation } from '@/hooks/exams/useExamCreation';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const STEPS = [
  { id: 1, title: 'Informations de base', description: 'Titre, type et matière' },
  { id: 2, title: 'Configuration', description: 'Durée, étudiants et paramètres' },
  { id: 3, title: 'Planification', description: 'Créneaux et ressources' },
  { id: 4, title: 'Révision', description: 'Validation et finalisation' }
];

export function CreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    examData, 
    updateExamData, 
    validateStep, 
    createExam, 
    saveDraft,
    isLoading 
  } = useExamCreation();

  const handleNext = async () => {
    const isValid = await validateStep(currentStep, examData);
    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // Finaliser la création
        try {
          await createExam(examData);
          toast({
            title: "Examen créé avec succès",
            description: "L'examen a été créé et planifié automatiquement.",
          });
          navigate('/exams');
        } catch (error) {
          toast({
            title: "Erreur lors de la création",
            description: "Une erreur est survenue lors de la création de l'examen.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft(examData);
      toast({
        title: "Brouillon sauvegardé",
        description: "Vos modifications ont été sauvegardées.",
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le brouillon.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo data={examData} onChange={updateExamData} />;
      case 2:
        return <Configuration data={examData} onChange={updateExamData} />;
      case 3:
        return <Scheduling data={examData} onChange={updateExamData} />;
      case 4:
        return <Review data={examData} onChange={updateExamData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <StepIndicator steps={STEPS} currentStep={currentStep} />
      
      {/* Main Content */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardContent className="p-8">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauver brouillon
          </Button>
        </div>

        <Button 
          className="bg-violet-600 hover:bg-violet-700"
          onClick={handleNext}
          disabled={isLoading}
        >
          {currentStep === 4 ? 'Créer l\'examen' : 'Suivant'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}