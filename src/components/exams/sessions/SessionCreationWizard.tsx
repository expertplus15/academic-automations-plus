
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Mail, 
  CheckCircle, 
  Clock,
  Building,
  AlertCircle
} from 'lucide-react';
import { useDUT2GESessionManager } from '@/hooks/exams/useDUT2GESessionManager';
import { useIntelligentPlanning } from '@/hooks/exams/useIntelligentPlanning';
import { useConvocationScheduler } from '@/hooks/exams/useConvocationScheduler';

interface SessionCreationWizardProps {
  academicYearId: string;
  programId: string;
  onSessionCreated?: (sessionId: string) => void;
}

export function SessionCreationWizard({ 
  academicYearId, 
  programId, 
  onSessionCreated 
}: SessionCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [planningResults, setPlanningResults] = useState<any[]>([]);
  const [convocationResults, setConvocationResults] = useState<any[]>([]);

  const { 
    createDUT2GESession, 
    loading: sessionLoading, 
    DUT2GE_SUBJECTS 
  } = useDUT2GESessionManager();

  const { 
    generateAutoPlan, 
    loading: planningLoading, 
    conflicts 
  } = useIntelligentPlanning();

  const { 
    createConvocationTemplates, 
    scheduleConvocations, 
    loading: convocationLoading 
  } = useConvocationScheduler();

  const steps = [
    {
      title: 'Création Session',
      description: 'Configuration session DUT2-GE S1-2324',
      icon: Calendar,
      action: async () => {
        const session = await createDUT2GESession(academicYearId, programId);
        if (session) {
          setSessionId(session.id);
          return true;
        }
        return false;
      }
    },
    {
      title: 'Planification Examens',
      description: 'Attribution automatique des créneaux',
      icon: BookOpen,
      action: async () => {
        if (!sessionId) return false;
        const results = await generateAutoPlan(sessionId);
        setPlanningResults(results);
        return results.length > 0;
      }
    },
    {
      title: 'Configuration Convocations',
      description: 'Préparation envoi automatique',
      icon: Mail,
      action: async () => {
        if (!sessionId) return false;
        await createConvocationTemplates();
        const results = await scheduleConvocations(sessionId);
        setConvocationResults(results);
        return results.length > 0;
      }
    }
  ];

  const handleNextStep = async () => {
    const step = steps[currentStep];
    const success = await step.action();
    
    if (success) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onSessionCreated?.(sessionId!);
      }
    }
  };

  const totalSubjects = DUT2GE_SUBJECTS.reduce((acc, sem) => acc + sem.subjects.length, 0);
  const isLoading = sessionLoading || planningLoading || convocationLoading;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-exams/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-exams" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Assistant Création Session DUT2-GE</h2>
              <p className="text-sm text-muted-foreground">
                Configuration automatique session S1-2324 avec 18 examens
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Étape {currentStep + 1} sur {steps.length}</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu de la configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-semibold">{totalSubjects} Examens</p>
                <p className="text-sm text-muted-foreground">9 S3 + 9 S4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-semibold">13 Étudiants</p>
                <p className="text-sm text-muted-foreground">DUT2-GE Session</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-purple-500" />
              <div>
                <p className="font-semibold">260 Convocations</p>
                <p className="text-sm text-muted-foreground">Envoi programmé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Étape actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <steps[currentStep].icon className="w-5 h-5 text-exams" />
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Semestre 3 - Janvier 2024</h4>
                  <div className="space-y-1">
                    {DUT2GE_SUBJECTS[0].subjects.map((subject, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{subject.name}</span>
                        <Badge variant="outline">{subject.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Semestre 4 - Juin 2024</h4>
                  <div className="space-y-1">
                    {DUT2GE_SUBJECTS[1].subjects.map((subject, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{subject.name}</span>
                        <Badge variant="outline">{subject.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              {planningResults.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Planification générée</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {planningResults.slice(0, 6).map((result, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Examen #{idx + 1}</span>
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Planifié
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(result.start_time).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  {conflicts.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">
                          {conflicts.length} conflit(s) détecté(s)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Génération automatique de la planification...
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              {convocationResults.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Convocations programmées</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Mail className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                        <p className="font-semibold">{convocationResults.length}</p>
                        <p className="text-sm text-muted-foreground">Convocations créées</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Calendar className="w-8 h-8 mx-auto text-green-500 mb-2" />
                        <p className="font-semibold">Envoi programmé</p>
                        <p className="text-sm text-muted-foreground">15j avant (écrits)</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                        <p className="font-semibold">Rappels</p>
                        <p className="text-sm text-muted-foreground">3j avant examen</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Configuration du système de convocations...
                  </p>
                </div>
              )}
            </div>
          )}

          <Separator />
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            >
              Précédent
            </Button>
            
            <Button 
              onClick={handleNextStep}
              disabled={isLoading}
            >
              {isLoading ? 'Configuration...' : 
               currentStep === steps.length - 1 ? 'Finaliser' : 'Suivant'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
