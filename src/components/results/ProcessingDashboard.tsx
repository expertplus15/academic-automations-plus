import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cpu, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  PauseCircle,
  AlertCircle
} from 'lucide-react';

export function ProcessingDashboard() {
  const [processingJobs, setProcessingJobs] = useState([
    {
      id: 1,
      name: 'Calcul moyennes L1 Math',
      type: 'averages',
      status: 'running',
      progress: 75,
      startTime: '14:30:15',
      estimatedEnd: '14:35:20',
      recordsProcessed: 1247,
      totalRecords: 1663
    },
    {
      id: 2,
      name: 'Génération bulletins L2',
      type: 'reports',
      status: 'queued',
      progress: 0,
      startTime: null,
      estimatedEnd: '14:40:00',
      recordsProcessed: 0,
      totalRecords: 892
    },
    {
      id: 3,
      name: 'Analyse statistiques M1',
      type: 'analytics',
      status: 'completed',
      progress: 100,
      startTime: '14:20:00',
      estimatedEnd: '14:28:45',
      recordsProcessed: 445,
      totalRecords: 445
    }
  ]);

  const systemMetrics = {
    cpuUsage: 68,
    memoryUsage: 45,
    activeJobs: 2,
    queuedJobs: 5,
    completedToday: 127,
    averageProcessingTime: '2.3s'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <PauseCircle className="w-4 h-4 text-gray-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'default';
      case 'queued':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'paused':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'averages':
        return 'Calculs moyennes';
      case 'reports':
        return 'Génération rapports';
      case 'analytics':
        return 'Analyses statistiques';
      default:
        return 'Traitement';
    }
  };

  return (
    <div className="space-y-6">
      {/* Métriques système */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{systemMetrics.cpuUsage}%</p>
                <p className="text-sm text-muted-foreground">CPU utilisé</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{systemMetrics.activeJobs}</p>
                <p className="text-sm text-muted-foreground">Jobs actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{systemMetrics.queuedJobs}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{systemMetrics.completedToday}</p>
                <p className="text-sm text-muted-foreground">Complétés aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ressources système */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Utilisation CPU</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={systemMetrics.cpuUsage} className="mb-2" />
            <p className="text-sm text-muted-foreground">{systemMetrics.cpuUsage}% utilisé</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mémoire</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={systemMetrics.memoryUsage} className="mb-2" />
            <p className="text-sm text-muted-foreground">{systemMetrics.memoryUsage}% utilisée</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Jobs actifs</TabsTrigger>
          <TabsTrigger value="queue">File d'attente</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Traitements en cours</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Pause tous
              </Button>
              <Button size="sm">
                Nouveau traitement
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {processingJobs
              .filter(job => job.status === 'running')
              .map(job => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <h4 className="font-medium">{job.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {getJobTypeLabel(job.type)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusColor(job.status) as any}>
                          {job.status === 'running' ? 'En cours' : 'En attente'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Pause
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{job.recordsProcessed} / {job.totalRecords} enregistrements</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Début: {job.startTime}</span>
                        <span>Fin estimée: {job.estimatedEnd}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <h3 className="text-lg font-semibold">File d'attente</h3>
          
          <div className="space-y-3">
            {processingJobs
              .filter(job => job.status === 'queued')
              .map(job => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <p className="font-medium">{job.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.totalRecords} enregistrements à traiter
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">En attente</Badge>
                        <Button variant="outline" size="sm">
                          Priorité
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h3 className="text-lg font-semibold">Historique des traitements</h3>
          
          <div className="space-y-3">
            {processingJobs
              .filter(job => job.status === 'completed')
              .map(job => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <p className="font-medium">{job.name}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Terminé à {job.estimatedEnd}</span>
                            <span>{job.totalRecords} enregistrements</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="default">Terminé</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration du traitement</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Limites de performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Jobs simultanés maximum</label>
                  <p className="text-sm text-muted-foreground">Actuellement: 3</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Timeout par job</label>
                  <p className="text-sm text-muted-foreground">Actuellement: 30 minutes</p>
                </div>
                <Button variant="outline">Modifier</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Alertes par email</label>
                  <p className="text-sm text-muted-foreground">Activées pour les erreurs</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Rapports automatiques</label>
                  <p className="text-sm text-muted-foreground">Hebdomadaires</p>
                </div>
                <Button variant="outline">Configurer</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}