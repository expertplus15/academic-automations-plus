import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cpu, 
  Zap, 
  BarChart3, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity
} from 'lucide-react';

interface ProcessingTask {
  id: string;
  name: string;
  type: 'calculation' | 'validation' | 'generation' | 'export';
  status: 'pending' | 'running' | 'completed' | 'paused' | 'error';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number;
  elapsedTime: number;
  details: string;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeProcesses: number;
  queueSize: number;
  avgProcessingTime: number;
  successRate: number;
}

export function ProcessingCenter() {
  const [tasks, setTasks] = useState<ProcessingTask[]>([
    {
      id: '1',
      name: 'Calcul moyennes L3 Informatique',
      type: 'calculation',
      status: 'running',
      progress: 65,
      priority: 'high',
      estimatedTime: 180,
      elapsedTime: 117,
      details: 'Traitement 156/240 étudiants'
    },
    {
      id: '2',
      name: 'Validation notes semestrielle',
      type: 'validation',
      status: 'pending',
      progress: 0,
      priority: 'medium',
      estimatedTime: 300,
      elapsedTime: 0,
      details: 'En attente de démarrage'
    },
    {
      id: '3',
      name: 'Génération bulletins M1',
      type: 'generation',
      status: 'completed',
      progress: 100,
      priority: 'high',
      estimatedTime: 120,
      elapsedTime: 108,
      details: '45 bulletins générés'
    }
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 62,
    activeProcesses: 3,
    queueSize: 2,
    avgProcessingTime: 145,
    successRate: 98.5
  });

  const [autoMode, setAutoMode] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 5, 100);
          const newElapsedTime = task.elapsedTime + 5;
          
          return {
            ...task,
            progress: newProgress,
            elapsedTime: newElapsedTime,
            status: newProgress >= 100 ? 'completed' : 'running'
          };
        }
        return task;
      }));

      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        activeProcesses: tasks.filter(t => t.status === 'running').length
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [tasks]);

  const getTaskIcon = (type: ProcessingTask['type']) => {
    switch (type) {
      case 'calculation':
        return <BarChart3 className="h-4 w-4" />;
      case 'validation':
        return <CheckCircle className="h-4 w-4" />;
      case 'generation':
        return <Zap className="h-4 w-4" />;
      case 'export':
        return <Activity className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: ProcessingTask['status']) => {
    const variants = {
      pending: { label: 'En attente', className: 'bg-gray-100 text-gray-800' },
      running: { label: 'En cours', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800' },
      paused: { label: 'Pausé', className: 'bg-yellow-100 text-yellow-800' },
      error: { label: 'Erreur', className: 'bg-red-100 text-red-800' }
    };
    
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getPriorityBadge = (priority: ProcessingTask['priority']) => {
    const variants = {
      low: { label: 'Faible', className: 'bg-gray-100 text-gray-600' },
      medium: { label: 'Moyenne', className: 'bg-blue-100 text-blue-600' },
      high: { label: 'Haute', className: 'bg-orange-100 text-orange-600' },
      critical: { label: 'Critique', className: 'bg-red-100 text-red-600' }
    };
    
    const variant = variants[priority];
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'running' } : task
    ));
  };

  const pauseTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'paused' } : task
    ));
  };

  const restartTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'running', progress: 0, elapsedTime: 0 } : task
    ));
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CPU</p>
                <p className="text-2xl font-bold">{metrics.cpuUsage}%</p>
              </div>
              <Cpu className="h-8 w-8 text-primary" />
            </div>
            <Progress value={metrics.cpuUsage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mémoire</p>
                <p className="text-2xl font-bold">{metrics.memoryUsage}%</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <Progress value={metrics.memoryUsage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processus actifs</p>
                <p className="text-2xl font-bold">{metrics.activeProcesses}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de succès</p>
                <p className="text-2xl font-bold">{metrics.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Contrôles de Traitement
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mode automatique</span>
              <Button
                variant={autoMode ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoMode(!autoMode)}
              >
                {autoMode ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {autoMode ? (
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Le traitement automatique est activé. Les tâches seront exécutées selon leur priorité.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Mode manuel activé. Vous devez démarrer les tâches manuellement.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Processing Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            File de Traitement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTaskIcon(task.type)}
                    <span className="font-medium">{task.name}</span>
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'pending' && (
                      <Button size="sm" onClick={() => startTask(task.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {task.status === 'running' && (
                      <Button size="sm" variant="outline" onClick={() => pauseTask(task.id)}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {(task.status === 'completed' || task.status === 'error') && (
                      <Button size="sm" variant="outline" onClick={() => restartTask(task.id)}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {task.status === 'running' && (
                  <div className="space-y-2">
                    <Progress value={task.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{task.details}</span>
                      <span>{formatTime(task.elapsedTime)} / {formatTime(task.estimatedTime)}</span>
                    </div>
                  </div>
                )}
                
                {task.status !== 'running' && (
                  <p className="text-sm text-muted-foreground">{task.details}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métriques de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">{formatTime(metrics.avgProcessingTime)}</p>
              <p className="text-sm text-muted-foreground">Temps moyen de traitement</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">{metrics.successRate}%</p>
              <p className="text-sm text-muted-foreground">Taux de succès</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{metrics.queueSize}</p>
              <p className="text-sm text-muted-foreground">Tâches en attente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}