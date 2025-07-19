import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { useExamGradeSync } from '@/hooks/useExamGradeSync';
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  BookOpen,
  ArrowRight,
  Activity,
  BarChart3,
  Workflow
} from 'lucide-react';

export function UnifiedDashboard() {
  const { events, loadCalendarEvents, triggerAutomaticActions } = useCalendarSync();
  const { examSessions, loadExamSessions } = useExamGradeSync();

  useEffect(() => {
    loadCalendarEvents();
    loadExamSessions();
  }, [loadCalendarEvents, loadExamSessions]);

  // Statistiques en temps réel
  const stats = {
    totalExams: examSessions.length,
    pendingGrades: examSessions.filter(e => !e.gradesCreated).length,
    activeWorkflows: examSessions.filter(e => !e.gradesCreated).length, // Simulé
    todayEvents: events.filter(e => e.date === new Date().toISOString().split('T')[0]).length
  };

  // Événements critiques (aujourd'hui et en retard)
  const criticalEvents = events.filter(e => 
    e.priority === 'critical' || 
    (e.date <= new Date().toISOString().split('T')[0] && e.status !== 'completed')
  );

  // Sessions d'examens récentes comme workflows simulés
  const recentSessions = examSessions.slice(0, 5);

  const handleAutoActions = async () => {
    await triggerAutomaticActions();
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Examens total</p>
                <p className="text-2xl font-bold">{stats.totalExams}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notes en attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingGrades}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Workflows actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeWorkflows}</p>
              </div>
              <Workflow className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Événements aujourd'hui</p>
                <p className="text-2xl font-bold text-purple-600">{stats.todayEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions automatiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Centre de Contrôle Automatisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={handleAutoActions} className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Exécuter Actions Automatiques
            </Button>
            <p className="text-sm text-muted-foreground">
              Déclenche les notifications et actions planifiées pour aujourd'hui
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Événements critiques */}
      {criticalEvents.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Attention Requise ({criticalEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.date} {event.time && `• ${event.time}`}
                      </div>
                    </div>
                  </div>
                  <Badge variant="destructive">{event.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions d'examens et calendrier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Sessions d'Examens Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.sessionId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{session.examTitle}</div>
                    <Badge variant={session.gradesCreated ? "default" : "secondary"}>
                      {session.gradesCreated ? "Terminé" : "En cours"}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={session.gradesCreated ? 100 : 50} 
                    className="h-2" 
                  />
                  
                  <div className="text-sm text-muted-foreground">
                    {session.examDate} • {session.studentCount} étudiants
                  </div>
                </div>
              ))}

              {recentSessions.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Aucune session d'examen récente
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calendrier des prochains événements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Prochains Événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .filter(e => e.date >= new Date().toISOString().split('T')[0])
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      {event.type === 'exam' && <BookOpen className="w-4 h-4 text-blue-500" />}
                      {event.type === 'grade_entry' && <Users className="w-4 h-4 text-orange-500" />}
                      {event.type === 'validation' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {event.type === 'convocation' && <Calendar className="w-4 h-4 text-purple-500" />}
                      
                      <div>
                        <div className="text-sm font-medium">{event.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {event.date} {event.time && `• ${event.time}`}
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={event.status === 'completed' ? 'default' : 
                               event.status === 'in_progress' ? 'secondary' : 'outline'}
                    >
                      {event.status}
                    </Badge>
                  </div>
                ))}

              {events.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun événement programmé
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation rapide vers les modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Accès Rapide aux Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => window.location.href = '/exams'}
            >
              <BookOpen className="w-6 h-6" />
              <span>Gestion Examens</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => window.location.href = '/results'}
            >
              <Users className="w-6 h-6" />
              <span>Saisie Notes</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => window.location.href = '/students'}
            >
              <CheckCircle className="w-6 h-6" />
              <span>Gestion Étudiants</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}