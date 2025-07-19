
import React, { useState, useEffect } from 'react';
import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Calendar, AlertTriangle, Zap, BarChart3 } from 'lucide-react';
import { useExams } from '@/hooks/useExams';
import { useExamConflictDetection } from '@/hooks/useExamConflictDetection';
import { usePrograms } from '@/hooks/usePrograms';
import { ExamConflictResolver } from '@/components/exams/ExamConflictResolver';
import { ExamScheduleGrid } from '@/components/exams/ExamScheduleGrid';
import { toast } from 'sonner';

export default function Planning() {
  const { exams, sessions, loading: examsLoading, fetchExams, fetchSessions } = useExams();
  const { 
    conflicts, 
    loading: conflictsLoading, 
    detectConflicts, 
    generateSchedule, 
    resolveConflict 
  } = useExamConflictDetection();
  const { programs } = usePrograms();
  
  const [selectedAcademicYear] = useState('2024-2025');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [generationInProgress, setGenerationInProgress] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchSessions();
    detectConflicts();
  }, []);

  const handleGenerateSchedule = async () => {
    if (!selectedAcademicYear) {
      toast.error('Veuillez sélectionner une année académique');
      return;
    }

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
      selectedProgram || undefined, 
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

  const criticalConflicts = conflicts.filter(c => c.severity === 'critical').length;
  const highConflicts = conflicts.filter(c => c.severity === 'high').length;
  const scheduledExams = exams.filter(e => e.status === 'scheduled').length;
  const draftExams = exams.filter(e => e.status === 'draft').length;

  return (
    <ExamsModuleLayout 
      title="Planification Examens IA" 
      subtitle="Système intelligent anti-conflits pour la planification automatique"
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dashboard de métriques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{scheduledExams}</p>
                    <p className="text-sm text-muted-foreground">Examens Planifiés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{draftExams}</p>
                    <p className="text-sm text-muted-foreground">À Planifier</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{conflicts.length}</p>
                    <p className="text-sm text-muted-foreground">Conflits Détectés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {conflicts.length === 0 ? '100%' : Math.max(0, 100 - (criticalConflicts * 10 + highConflicts * 5)) + '%'}
                    </p>
                    <p className="text-sm text-muted-foreground">Taux de Réussite</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contrôles de génération */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Générateur IA Anti-Conflits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleGenerateSchedule} 
                  disabled={generationInProgress || examsLoading}
                  className="flex items-center gap-2"
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
                <Alert variant="destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    {criticalConflicts} conflit(s) critique(s) détecté(s) ! Résolution immédiate recommandée.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-semibold text-blue-800">✅ Anti-Conflit Automatique</h4>
                  <p className="text-blue-700">Détection intelligente des chevauchements</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-semibold text-green-800">🧠 Optimisation IA</h4>
                  <p className="text-green-700">Algorithme d'optimisation des ressources</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <h4 className="font-semibold text-purple-800">⚡ Résolution Rapide</h4>
                  <p className="text-purple-700">Suggestions automatiques de résolution</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interface principale avec onglets */}
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calendar">Planning Visuel</TabsTrigger>
              <TabsTrigger value="conflicts">
                Résolution Conflits {conflicts.length > 0 && `(${conflicts.length})`}
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics IA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-4">
              <ExamScheduleGrid 
                sessions={sessions}
                onSessionClick={(session) => {
                  toast.info(`Session: ${session.id}`);
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
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Performance IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Répartition des Conflits</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Critiques:</span>
                          <span className="font-bold text-red-600">{criticalConflicts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Élevés:</span>
                          <span className="font-bold text-orange-600">{highConflicts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Moyens:</span>
                          <span className="font-bold text-yellow-600">
                            {conflicts.filter(c => c.severity === 'medium').length}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Performance de l'IA</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Examens traités:</span>
                          <span className="font-bold">{exams.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux de succès:</span>
                          <span className="font-bold text-green-600">
                            {exams.length > 0 ? Math.round((scheduledExams / exams.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sessions créées:</span>
                          <span className="font-bold">{sessions.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExamsModuleLayout>
  );
}
