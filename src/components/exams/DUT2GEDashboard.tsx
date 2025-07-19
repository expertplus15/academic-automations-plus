
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useDUT2GESessionManager } from '@/hooks/exams/useDUT2GESessionManager';
import { useIntelligentPlanning } from '@/hooks/exams/useIntelligentPlanning';
import { useConvocationScheduler } from '@/hooks/exams/useConvocationScheduler';
import {
  Calendar,
  Users,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  Mail,
  BarChart3,
  TrendingUp,
  BookOpen,
  Target,
  Settings
} from 'lucide-react';

export function DUT2GEDashboard() {
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [convocationStats, setConvocationStats] = useState<any>(null);
  
  const { 
    getDUT2GESession, 
    getSessionStats, 
    createDUT2GESession,
    loading: sessionLoading 
  } = useDUT2GESessionManager();
  
  const { 
    generateAutoPlan, 
    detectConflicts, 
    optimizeSchedule,
    conflicts, 
    loading: planningLoading 
  } = useIntelligentPlanning();
  
  const { 
    scheduleConvocations, 
    getConvocationStats,
    createConvocationTemplates,
    loading: convocationLoading 
  } = useConvocationScheduler();

  // Charger les données au montage
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Charger la session DUT2-GE
      const sessionData = await getDUT2GESession();
      setCurrentSession(sessionData);
      
      // Charger les statistiques
      const stats = await getSessionStats();
      setSessionStats(stats);
      
      // Charger les statistiques de convocations
      if (sessionData.session) {
        const convocStats = await getConvocationStats(sessionData.session.id);
        setConvocationStats(convocStats);
      }
      
      // Détecter les conflits
      await detectConflicts();
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    }
  };

  const handleInitializeSession = async () => {
    try {
      await createDUT2GESession(
        '550e8400-e29b-41d4-a716-446655440002', // Program ID
        '550e8400-e29b-41d4-a716-446655440001'  // Academic Year ID
      );
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur initialisation session:', error);
    }
  };

  const handleGeneratePlanning = async () => {
    if (!currentSession?.session?.id) return;
    
    await generateAutoPlan(currentSession.session.id);
    await loadDashboardData();
  };

  const handleScheduleConvocations = async () => {
    if (!currentSession?.session?.id || !currentSession?.exams) return;
    
    const examIds = currentSession.exams.map((exam: any) => exam.id);
    await scheduleConvocations(currentSession.session.id, examIds);
    await loadDashboardData();
  };

  const handleOptimizeSchedule = async () => {
    if (!currentSession?.session?.id) return;
    
    await optimizeSchedule(currentSession.session.id);
    await loadDashboardData();
  };

  if (!currentSession && !sessionLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Initialisation Module DUT2-GE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Aucune session DUT2-GE trouvée. Cliquez pour initialiser la session S1-2324-DUTGE avec les 18 examens.
            </p>
            <Button onClick={handleInitializeSession} disabled={sessionLoading}>
              {sessionLoading ? 'Initialisation...' : 'Initialiser Session DUT2-GE'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête de session */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {currentSession?.session?.name || 'Session DUT2-GE'}
              </CardTitle>
              <p className="text-muted-foreground">
                Code: {currentSession?.session?.code} • 
                Status: <Badge variant="secondary">{currentSession?.session?.status}</Badge>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background">
                <Calendar className="w-4 h-4 mr-1" />
                Semestre 1 - 2023/2024
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Examens Total</p>
                <p className="text-2xl font-bold">{sessionStats?.totalExams || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planifiés</p>
                <p className="text-2xl font-bold">{sessionStats?.scheduledSessions || 0}</p>
                <p className="text-xs text-green-600">
                  {sessionStats?.progressPercentage || 0}% terminé
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conflits</p>
                <p className="text-2xl font-bold text-orange-600">{conflicts.length}</p>
                <p className="text-xs text-muted-foreground">
                  {conflicts.filter(c => c.severity === 'critical').length} critiques
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Convocations</p>
                <p className="text-2xl font-bold">{convocationStats?.total || 0}</p>
                <p className="text-xs text-blue-600">
                  {convocationStats?.sent || 0} envoyées
                </p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progression de la Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Planification des examens</span>
                <span>{sessionStats?.progressPercentage || 0}%</span>
              </div>
              <Progress value={sessionStats?.progressPercentage || 0} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Écrits S3</p>
                <p className="font-semibold">{sessionStats?.s3Exams || 0} examens</p>
              </div>
              <div>
                <p className="text-muted-foreground">Écrits S4</p>
                <p className="font-semibold">{sessionStats?.s4Exams || 0} examens</p>
              </div>
              <div>
                <p className="text-muted-foreground">Oraux</p>
                <p className="font-semibold">{sessionStats?.oralExams || 0} soutenances</p>
              </div>
              <div>
                <p className="text-muted-foreground">Surveillants</p>
                <p className="font-semibold">{sessionStats?.totalSupervisors || 0} assignés</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions intelligentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Planification Intelligente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Génération automatique des créneaux avec résolution de conflits par IA
            </p>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleGeneratePlanning} 
                disabled={planningLoading}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                {planningLoading ? 'Génération...' : 'Générer Planning'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleOptimizeSchedule}
                disabled={planningLoading}
              >
                <Target className="w-4 h-4 mr-2" />
                Optimiser
              </Button>
            </div>

            {conflicts.length > 0 && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Conflits détectés</span>
                </div>
                <div className="space-y-1">
                  {conflicts.slice(0, 3).map((conflict, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      • {conflict.title}
                    </p>
                  ))}
                  {conflicts.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{conflicts.length - 3} autres conflits...
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Convocations Automatiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Programmation et envoi automatique des convocations étudiants
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Programmées</p>
                <p className="font-semibold">{convocationStats?.scheduled || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Envoyées</p>
                <p className="font-semibold">{convocationStats?.sent || 0}</p>
              </div>
            </div>

            <Button 
              onClick={handleScheduleConvocations} 
              disabled={convocationLoading}
              className="w-full"
              variant="outline"
            >
              <Mail className="w-4 h-4 mr-2" />
              {convocationLoading ? 'Programmation...' : 'Programmer Convocations'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics de Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sessionStats?.progressPercentage || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Taux de planification</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {convocationStats?.successRate || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Taux d'envoi convocations</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {conflicts.length === 0 ? '100' : Math.max(0, 100 - conflicts.length * 5)}%
              </div>
              <div className="text-sm text-muted-foreground">Optimisation IA</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
