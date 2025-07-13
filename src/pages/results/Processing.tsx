import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Cpu, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Settings,
  Zap,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { ProcessingJobsPanel } from '@/components/results/processing/ProcessingJobsPanel';
import { AIModelsPanel } from '@/components/results/processing/AIModelsPanel';
import { AnomalyDetectionPanel } from '@/components/results/processing/AnomalyDetectionPanel';
import { useAdvancedProcessing } from '@/hooks/useAdvancedProcessing';

export default function Processing() {
  const { jobs, aiModels, anomalies, loading } = useAdvancedProcessing();
  
  // Statistiques pour le tableau de bord
  const stats = {
    activeJobs: jobs.filter(job => job.status === 'running').length,
    completedToday: jobs.filter(job => 
      job.status === 'completed' && 
      job.completed_at && 
      new Date(job.completed_at).toDateString() === new Date().toDateString()
    ).length,
    activeModels: aiModels.filter(model => model.status === 'active').length,
    criticalAnomalies: anomalies.filter(anomaly => anomaly.severity === 'critical' && anomaly.status === 'new').length,
    avgModelAccuracy: aiModels.length > 0 
      ? (aiModels.reduce((sum, model) => sum + model.accuracy, 0) / aiModels.length).toFixed(1)
      : 0,
    totalAnomalies: anomalies.filter(anomaly => anomaly.status === 'new').length
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout 
        title="Traitement Avancé" 
        subtitle="Intelligence artificielle, analyse prédictive et automatisation"
        showHeader={true}
      >
        <div className="p-6 space-y-6">
          {/* Vue d'ensemble */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeJobs}</p>
                    <p className="text-sm text-muted-foreground">Traitements actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedToday}</p>
                    <p className="text-sm text-muted-foreground">Terminés aujourd'hui</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeModels}</p>
                    <p className="text-sm text-muted-foreground">Modèles IA actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.criticalAnomalies}</p>
                    <p className="text-sm text-muted-foreground">Anomalies critiques</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.avgModelAccuracy}%</p>
                    <p className="text-sm text-muted-foreground">Précision moyenne IA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalAnomalies}</p>
                    <p className="text-sm text-muted-foreground">Nouvelles anomalies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions système rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Actions Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-auto p-4 flex-col gap-2">
                  <RefreshCw className="w-6 h-6" />
                  <span>Synchroniser modules</span>
                  <span className="text-xs opacity-70">Dernière sync: 2h</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>Recalculer tout</span>
                  <span className="text-xs opacity-70">Moyennes + ECTS</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Brain className="w-6 h-6" />
                  <span>Réentraîner IA</span>
                  <span className="text-xs opacity-70">Tous les modèles</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Settings className="w-6 h-6" />
                  <span>Configuration</span>
                  <span className="text-xs opacity-70">Paramètres avancés</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Onglets principaux */}
          <Tabs defaultValue="jobs" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Traitements
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Modèles IA
              </TabsTrigger>
              <TabsTrigger value="anomalies" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Anomalies
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <ProcessingJobsPanel />
            </TabsContent>

            <TabsContent value="ai">
              <AIModelsPanel />
            </TabsContent>

            <TabsContent value="anomalies">
              <AnomalyDetectionPanel />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Tendances Prédictives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Taux de réussite prévu</span>
                          <Badge variant="outline">+2.3%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Amélioration attendue pour ce semestre
                        </p>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Risque d'abandon</span>
                          <Badge variant="destructive">5.2%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Étudiants à risque identifiés
                        </p>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Matières difficiles</span>
                          <Badge variant="secondary">3 identifiées</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Nécessitent un renforcement pédagogique
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Performance Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Charge processeur</span>
                        <span className="font-medium">23%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Mémoire utilisée</span>
                        <span className="font-medium">1.2 GB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Temps de réponse IA</span>
                        <span className="font-medium">147ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Disponibilité système</span>
                        <Badge variant="default">99.8%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}