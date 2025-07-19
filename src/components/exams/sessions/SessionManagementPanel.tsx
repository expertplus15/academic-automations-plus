
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDUT2GESessionManager } from '@/hooks/exams/useDUT2GESessionManager';
import { useIntelligentPlanning } from '@/hooks/exams/useIntelligentPlanning';
import { Calendar, Users, Clock, FileText, AlertTriangle, CheckCircle, Brain, Zap } from 'lucide-react';

interface SessionManagementPanelProps {
  academicYearId: string;
  programId: string;
}

export function SessionManagementPanel({ academicYearId, programId }: SessionManagementPanelProps) {
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [sessionStats, setSessionStats] = useState<any>(null);
  
  const { 
    getDUT2GESession, 
    getSessionStats, 
    createDUT2GESession,
    loading: sessionLoading 
  } = useDUT2GESessionManager();
  
  const { 
    generateAutoPlan, 
    detectConflicts, 
    conflicts, 
    loading: planningLoading 
  } = useIntelligentPlanning();

  useEffect(() => {
    loadSessionData();
  }, [academicYearId, programId]);

  const loadSessionData = async () => {
    try {
      const sessionData = await getDUT2GESession();
      setCurrentSession(sessionData);
      
      const stats = await getSessionStats();
      setSessionStats(stats);
      
      await detectConflicts();
    } catch (error) {
      console.error('Erreur chargement session:', error);
    }
  };

  const handleCreateSession = async () => {
    try {
      await createDUT2GESession(programId, academicYearId);
      await loadSessionData();
    } catch (error) {
      console.error('Erreur création session:', error);
    }
  };

  const handleGeneratePlanning = async () => {
    if (!currentSession?.session?.id) return;
    
    await generateAutoPlan(currentSession.session.id);
    await loadSessionData();
  };

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!currentSession ? (
        <Card>
          <CardHeader>
            <CardTitle>Créer une Session DUT2-GE</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Aucune session trouvée pour ce programme. Créez une nouvelle session pour commencer.
            </p>
            <Button onClick={handleCreateSession} disabled={sessionLoading}>
              {sessionLoading ? 'Création...' : 'Créer Session S1-2324-DUTGE'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Informations de session */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentSession.session.name}</CardTitle>
                  <p className="text-muted-foreground">
                    Code: {currentSession.session.code}
                  </p>
                </div>
                <Badge variant={currentSession.session.status === 'active' ? 'default' : 'secondary'}>
                  {currentSession.session.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-2 mx-auto">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Examens</p>
                  <p className="text-lg font-semibold">{sessionStats?.totalExams || 0}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Planifiés</p>
                  <p className="text-lg font-semibold">{sessionStats?.scheduledSessions || 0}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-2 mx-auto">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Conflits</p>
                  <p className="text-lg font-semibold">{conflicts.length}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Surveillants</p>
                  <p className="text-lg font-semibold">{sessionStats?.totalSupervisors || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions de planification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Planification Intelligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Utilisez l'IA pour générer automatiquement les créneaux d'examens et résoudre les conflits.
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleGeneratePlanning} 
                    disabled={planningLoading}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {planningLoading ? 'Génération...' : 'Générer Planning IA'}
                  </Button>
                  
                  <Button variant="outline" onClick={() => detectConflicts()}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Détecter Conflits
                  </Button>
                </div>

                {conflicts.length > 0 && (
                  <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                      Conflits détectés ({conflicts.length})
                    </h4>
                    <div className="space-y-2">
                      {conflicts.slice(0, 3).map((conflict, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{conflict.title}</p>
                            <p className="text-xs text-muted-foreground">{conflict.description}</p>
                          </div>
                        </div>
                      ))}
                      {conflicts.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{conflicts.length - 3} autres conflits...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Répartition des examens */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Examens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Semestre 3</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Examens écrits</span>
                      <Badge variant="outline">{sessionStats?.s3Exams || 0}</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Semestre 4</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Examens écrits</span>
                      <Badge variant="outline">{sessionStats?.s4Exams || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Soutenances orales</span>
                      <Badge variant="outline">{sessionStats?.oralExams || 0}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
