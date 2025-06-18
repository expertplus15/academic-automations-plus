
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Brain,
  Zap
} from 'lucide-react';
import { useExams } from '@/hooks/useExams';
import { useExamConflictDetection } from '@/hooks/useExamConflictDetection';
import { useSupervisors } from '@/hooks/useSupervisors';
import { ExamsList } from './ExamsList';
import { ExamConflictResolver } from './ExamConflictResolver';
import { ExamScheduleGrid } from './ExamScheduleGrid';
import { toast } from 'sonner';

export function ExamDashboard() {
  const { exams, sessions, loading: examsLoading, fetchExams, fetchSessions } = useExams();
  const { 
    conflicts, 
    loading: conflictsLoading, 
    detectConflicts, 
    generateSchedule, 
    resolveConflict 
  } = useExamConflictDetection();
  const { supervisors, loading: supervisorsLoading } = useSupervisors();

  const [selectedAcademicYear] = useState('2024-2025');
  const [generationInProgress, setGenerationInProgress] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchSessions();
    detectConflicts();
  }, []);

  // Métriques calculées
  const totalExams = exams.length;
  const scheduledExams = exams.filter(e => e.status === 'scheduled').length;
  const draftExams = exams.filter(e => e.status === 'draft').length;
  const completedExams = exams.filter(e => e.status === 'completed').length;
  const totalSupervisors = supervisors.length;
  const availableSupervisors = supervisors.filter(s => s.status === 'available').length;
  const criticalConflicts = conflicts.filter(c => c.severity === 'critical').length;
  const highConflicts = conflicts.filter(c => c.severity === 'high').length;
  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    const now = new Date();
    return sessionDate > now;
  }).length;

  const handleGenerateSchedule = async () => {
    setGenerationInProgress(true);
    const parameters = {
      optimize_capacity: true,
      respect_break_times: true,
      max_exams_per_day: 3,
      preferred_start_hour: 8,
      preferred_end_hour: 18
    };

    const result = await generateSchedule(
      selectedAcademicYear, 
      undefined, 
      parameters
    );
    
    if (result) {
      toast.success('Planning d\'examens généré avec succès !');
      await fetchExams();
      await fetchSessions();
    } else {
      toast.error('Erreur lors de la génération du planning');
    }
    
    setGenerationInProgress(false);
  };

  const handleDetectConflicts = async () => {
    await detectConflicts(selectedAcademicYear);
    if (conflicts.length === 0) {
      toast.success('Aucun conflit détecté !');
    } else {
      toast.warning(`${conflicts.length} conflit(s) détecté(s)`);
    }
  };

  const handleResolveConflict = async (conflictId: string, resolution: string) => {
    await resolveConflict(conflictId, resolution);
    toast.success('Conflit résolu avec succès');
  };

  const loading = examsLoading || conflictsLoading || supervisorsLoading;

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExams}</p>
                <p className="text-sm text-muted-foreground">Examens Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scheduledExams}</p>
                <p className="text-sm text-muted-foreground">Planifiés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{conflicts.length}</p>
                <p className="text-sm text-muted-foreground">Conflits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{availableSupervisors}</p>
                <p className="text-sm text-muted-foreground">Surveillants Dispo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Brouillons</p>
                <p className="text-2xl font-bold text-blue-900">{draftExams}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Terminés</p>
                <p className="text-2xl font-bold text-green-900">{completedExams}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Sessions Prévues</p>
                <p className="text-2xl font-bold text-purple-900">{upcomingSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Générateur IA */}
      <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            🤖 Générateur IA Anti-Conflits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleGenerateSchedule} 
              disabled={generationInProgress || loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              <Zap className="w-4 h-4" />
              {generationInProgress ? 'Génération IA...' : 'Générer Planning Intelligent'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDetectConflicts}
              disabled={conflictsLoading}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Analyser les Conflits
            </Button>
          </div>

          {criticalConflicts > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">
                  {criticalConflicts} conflit(s) critique(s) détecté(s) !
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/50 p-3 rounded border">
              <h4 className="font-semibold text-blue-800 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Anti-Conflit Auto
              </h4>
              <p className="text-blue-700">Détection intelligente des chevauchements</p>
            </div>
            <div className="bg-white/50 p-3 rounded border">
              <h4 className="font-semibold text-green-800 flex items-center gap-1">
                <Brain className="w-4 h-4" />
                Optimisation IA
              </h4>
              <p className="text-green-700">Algorithme d'optimisation des ressources</p>
            </div>
            <div className="bg-white/50 p-3 rounded border">
              <h4 className="font-semibold text-purple-800 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Résolution Rapide
              </h4>
              <p className="text-purple-700">Suggestions automatiques de résolution</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface principale avec onglets */}
      <Tabs defaultValue="exams" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="exams">
            Examens ({totalExams})
          </TabsTrigger>
          <TabsTrigger value="calendar">
            Planning Visuel
          </TabsTrigger>
          <TabsTrigger value="conflicts">
            Conflits {conflicts.length > 0 && `(${conflicts.length})`}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics IA
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="exams" className="space-y-4">
          <ExamsList />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <ExamScheduleGrid 
            sessions={sessions}
            onSessionClick={(session) => {
              toast.info(`Session: ${session.id.slice(0, 8)}`);
            }}
          />
        </TabsContent>
        
        <TabsContent value="conflicts" className="space-y-4">
          <ExamConflictResolver
            conflicts={conflicts}
            loading={conflictsLoading}
            onResolveConflict={handleResolveConflict}
            onDetectConflicts={handleDetectConflicts}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Répartition des Examens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Brouillons:</span>
                    <Badge variant="outline">{draftExams}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Planifiés:</span>
                    <Badge className="bg-blue-100 text-blue-800">{scheduledExams}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Terminés:</span>
                    <Badge className="bg-green-100 text-green-800">{completedExams}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taux de planification:</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {totalExams > 0 ? Math.round((scheduledExams / totalExams) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Conflits Critiques:</span>
                    <Badge variant={criticalConflicts > 0 ? "destructive" : "outline"}>
                      {criticalConflicts}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conflits Élevés:</span>
                    <Badge variant={highConflicts > 0 ? "destructive" : "outline"}>
                      {highConflicts}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taux de succès:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {conflicts.length === 0 ? '100%' : Math.max(0, 100 - (criticalConflicts * 10 + highConflicts * 5)) + '%'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sessions créées:</span>
                    <Badge variant="outline">{sessions.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
