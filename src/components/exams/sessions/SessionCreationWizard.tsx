import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Calendar, Mail, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { useDUT2GESessionManager } from '@/hooks/exams/useDUT2GESessionManager';
import { useConvocationScheduler } from '@/hooks/exams/useConvocationScheduler';

export function SessionCreationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [convocationsScheduled, setConvocationsScheduled] = useState(false);

  const { createDUT2GESession, DUT2GE_SUBJECTS } = useDUT2GESessionManager();
  const { scheduleConvocations } = useConvocationScheduler();

  const steps = [
    {
      id: 0,
      title: 'Configuration Session',
      description: 'Créer la session DUT2-GE S1-2324',
      icon: Calendar,
      completed: sessionCreated
    },
    {
      id: 1,
      title: 'Planification Examens',
      description: 'Configurer les 18 examens automatiquement',
      icon: Users,
      completed: sessionCreated && currentStep > 1
    },
    {
      id: 2,
      title: 'Convocations',
      description: 'Programmer l\'envoi des convocations',
      icon: Mail,
      completed: convocationsScheduled
    }
  ];

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      await createDUT2GESession('dut-ge', '2023-2024');
      setSessionCreated(true);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleConvocations = async () => {
    setLoading(true);
    try {
      await scheduleConvocations('session-1', []);
      setConvocationsScheduled(true);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error scheduling convocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Assistant de Création Session DUT2-GE</h2>
        <p className="text-muted-foreground">
          Créez automatiquement la session S1-2324 avec 18 examens configurés
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex items-center space-x-2 ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    React.createElement(step.icon, { className: "w-5 h-5" })
                  )}
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">18</div>
            <p className="text-sm text-muted-foreground">Examens prévus</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">36</div>
            <p className="text-sm text-muted-foreground">Surveillants requis</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">260</div>
            <p className="text-sm text-muted-foreground">Convocations prévues</p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu de l'étape actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {React.createElement(steps[currentStep].icon, { className: "w-5 h-5 text-exams" })}
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Code Session</label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="font-mono">S1-2324-DUTGE</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Programme</label>
                  <div className="p-3 bg-muted rounded-md">
                    <span>DUT Gestion des Entreprises</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <div className="p-3 bg-muted rounded-md">
                  <span>Session 1 - Année 2023/2024 - DUT Gestion des Entreprises</span>
                </div>
              </div>

              <div className="p-4 bg-info/10 rounded-lg">
                <h4 className="font-medium mb-2">Configuration automatique :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 9 examens S3 (Janvier 2024)</li>
                  <li>• 9 examens S4 (Juin 2024)</li>
                  <li>• Attribution automatique des surveillants</li>
                  <li>• Programmation des convocations</li>
                </ul>
              </div>

              {!sessionCreated && (
                <Button 
                  onClick={handleCreateSession} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Création en cours...' : 'Créer la Session'}
                </Button>
              )}

              {sessionCreated && (
                <div className="flex items-center justify-center p-4 bg-success/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success mr-2" />
                  <span className="text-success font-medium">Session créée avec succès !</span>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Semestre 3 (Janvier 2024)</h4>
                  <div className="space-y-2">
                    {DUT2GE_SUBJECTS.slice(0, 9).map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{subject}</span>
                        <Badge variant="secondary">Écrit</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Semestre 4 (Juin 2024)</h4>
                  <div className="space-y-2">
                    {DUT2GE_SUBJECTS.slice(9, 18).map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{subject}</span>
                        <Badge variant={subject.includes('PP') || subject === 'Projet' || subject === 'Stage' ? 'default' : 'secondary'}>
                          {subject.includes('PP') || subject === 'Projet' || subject === 'Stage' ? 'Oral' : 'Écrit'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-success/10 rounded-lg">
                <p className="text-sm text-success text-center">
                  ✓ Tous les examens ont été configurés automatiquement
                </p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Total: {DUT2GE_SUBJECTS.length} examens
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Convocations initiales</h4>
                    <div className="text-2xl font-bold text-primary">234</div>
                    <p className="text-sm text-muted-foreground">13 étudiants × 18 examens</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Rappels automatiques</h4>
                    <div className="text-2xl font-bold text-warning">26</div>
                    <p className="text-sm text-muted-foreground">3 jours avant chaque examen</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <span className="text-sm">Examens écrits (15 jours avant)</span>
                  <Badge variant="secondary">14 examens</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <span className="text-sm">Soutenances orales (7 jours avant)</span>
                  <Badge variant="default">4 examens</Badge>
                </div>
              </div>

              {!convocationsScheduled && (
                <Button 
                  onClick={handleScheduleConvocations}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Programmation en cours...' : 'Programmer les Convocations'}
                </Button>
              )}

              {convocationsScheduled && (
                <div className="flex items-center justify-center p-4 bg-success/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success mr-2" />
                  <span className="text-success font-medium">Convocations programmées avec succès !</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}