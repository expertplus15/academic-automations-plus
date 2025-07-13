import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Activity
} from 'lucide-react';
import { useAdvancedProcessing } from '@/hooks/useAdvancedProcessing';
import { useToast } from '@/hooks/use-toast';

export function ProcessingJobsPanel() {
  const { jobs, loading, startProcessingJob, stopProcessingJob } = useAdvancedProcessing();
  const { toast } = useToast();
  const [startingJobs, setStartingJobs] = useState<Set<string>>(new Set());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running':
        return <Activity className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'running':
        return 'outline';
      case 'failed':
        return 'destructive';
      case 'scheduled':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'calculation':
        return <BarChart3 className="w-4 h-4" />;
      case 'prediction':
        return <Activity className="w-4 h-4" />;
      case 'anomaly_detection':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'calculation':
        return 'Calcul';
      case 'prediction':
        return 'Prédiction';
      case 'anomaly_detection':
        return 'Détection d\'anomalies';
      case 'automation':
        return 'Automatisation';
      default:
        return type;
    }
  };

  const handleStartJob = async (jobType: string, jobName: string, parameters: any) => {
    try {
      setStartingJobs(prev => new Set(prev).add(jobType));
      await startProcessingJob(jobType, parameters);
      toast({
        title: "Traitement lancé",
        description: `${jobName} a été démarré avec succès`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer le traitement",
        variant: "destructive",
      });
    } finally {
      setStartingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobType);
        return newSet;
      });
    }
  };

  const handleStopJob = async (jobId: string, jobName: string) => {
    try {
      await stopProcessingJob(jobId);
      toast({
        title: "Traitement arrêté",
        description: `${jobName} a été arrêté`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter le traitement",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const quickActions = [
    {
      name: 'Calculer moyennes semestrielles',
      type: 'calculation',
      parameters: { semester: 1, academic_year: '2024-25' },
      icon: BarChart3,
      description: 'Recalcul des moyennes pour le semestre en cours'
    },
    {
      name: 'Analyser risques d\'abandon',
      type: 'prediction',
      parameters: { model: 'dropout_risk_v2', scope: 'all_students' },
      icon: Activity,
      description: 'Évaluation prédictive des risques d\'abandon'
    },
    {
      name: 'Détecter anomalies',
      type: 'anomaly_detection',
      parameters: { sensitivity: 'high', timeframe: 'last_week' },
      icon: AlertTriangle,
      description: 'Scan complet pour détecter les anomalies'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-green-600" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const isStarting = startingJobs.has(action.type);
              
              return (
                <div key={action.type} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{action.name}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleStartJob(action.type, action.name, action.parameters)}
                    disabled={isStarting}
                  >
                    {isStarting ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        Démarrage...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Lancer
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Traitements en cours et historique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Traitements en Cours et Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun traitement en cours ou récent</p>
                <p className="text-sm mt-2">Utilisez les actions rapides ci-dessus pour démarrer un traitement</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        {getJobTypeIcon(job.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{job.name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Type: {getJobTypeLabel(job.type)}</span>
                          {job.started_at && (
                            <span>Démarré: {new Date(job.started_at).toLocaleString()}</span>
                          )}
                          {job.duration_seconds && (
                            <span>Durée: {formatDuration(job.duration_seconds)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <Badge variant={getStatusColor(job.status) as any}>
                        {job.status === 'completed' && 'Terminé'}
                        {job.status === 'running' && 'En cours'}
                        {job.status === 'failed' && 'Échec'}
                        {job.status === 'scheduled' && 'Programmé'}
                        {job.status === 'idle' && 'En attente'}
                      </Badge>
                    </div>
                  </div>

                  {job.status === 'running' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="animate-pulse" />
                    </div>
                  )}

                  {job.error_message && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      {job.error_message}
                    </div>
                  )}

                  {job.results && (
                    <div className="mb-3 p-3 bg-muted rounded">
                      <p className="text-sm font-medium mb-2">Résultats:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(job.results).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="ml-1 font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.status === 'running' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStopJob(job.id, job.name)}
                      >
                        <Square className="w-3 h-3 mr-2" />
                        Arrêter
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pause className="w-3 h-3 mr-2" />
                        Suspendre
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}