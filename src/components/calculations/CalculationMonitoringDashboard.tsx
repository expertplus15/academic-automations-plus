import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Server, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Play,
  Pause,
  StopCircle,
  RotateCcw
} from "lucide-react";

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  active_processes: number;
  queue_size: number;
  avg_response_time: number;
  success_rate: number;
}

interface ActiveCalculation {
  id: string;
  type: string;
  progress: number;
  started_at: string;
  estimated_completion: string;
  records_processed: number;
  total_records: number;
}

export function CalculationMonitoringDashboard() {
  // Données simulées - à remplacer par de vraies données
  const systemMetrics: SystemMetrics = {
    cpu_usage: 45,
    memory_usage: 67,
    active_processes: 3,
    queue_size: 12,
    avg_response_time: 1250,
    success_rate: 98.5
  };

  const activeCalculations: ActiveCalculation[] = [
    {
      id: "calc-001",
      type: "Moyennes générales",
      progress: 73,
      started_at: "14:32",
      estimated_completion: "14:47",
      records_processed: 1825,
      total_records: 2500
    },
    {
      id: "calc-002", 
      type: "Validation ECTS",
      progress: 42,
      started_at: "14:38",
      estimated_completion: "14:52",
      records_processed: 189,
      total_records: 450
    }
  ];

  const getStatusBadge = (value: number, thresholds: { warning: number; danger: number }) => {
    if (value >= thresholds.danger) return "destructive";
    if (value >= thresholds.warning) return "secondary";
    return "default";
  };

  return (
    <div className="space-y-6">
      {/* Métriques système en temps réel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-500" />
            Surveillance Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">CPU</span>
                <Badge variant={getStatusBadge(systemMetrics.cpu_usage, { warning: 70, danger: 85 })}>
                  {systemMetrics.cpu_usage}%
                </Badge>
              </div>
              <Progress value={systemMetrics.cpu_usage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mémoire</span>
                <Badge variant={getStatusBadge(systemMetrics.memory_usage, { warning: 75, danger: 90 })}>
                  {systemMetrics.memory_usage}%
                </Badge>
              </div>
              <Progress value={systemMetrics.memory_usage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de réussite</span>
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  {systemMetrics.success_rate}%
                </Badge>
              </div>
              <Progress value={systemMetrics.success_rate} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{systemMetrics.active_processes}</div>
              <div className="text-xs text-muted-foreground">Processus actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{systemMetrics.queue_size}</div>
              <div className="text-xs text-muted-foreground">En file d'attente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{systemMetrics.avg_response_time}ms</div>
              <div className="text-xs text-muted-foreground">Temps de réponse</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                <TrendingUp className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-xs text-muted-foreground">Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculs en cours */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Calculs en Cours
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pausé
              </Button>
              <Button size="sm" variant="outline">
                <StopCircle className="w-4 h-4 mr-2" />
                Arrêter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeCalculations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun calcul en cours</p>
              <p className="text-sm">Les calculs actifs apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeCalculations.map((calc) => (
                <div key={calc.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Activity className="w-3 h-3 animate-pulse" />
                        En cours
                      </Badge>
                      <span className="font-medium">{calc.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Début: {calc.started_at}</span>
                      <span>Fin estimée: {calc.estimated_completion}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{calc.progress}%</span>
                    </div>
                    <Progress value={calc.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{calc.records_processed.toLocaleString()} / {calc.total_records.toLocaleString()} enregistrements</span>
                      <span>{calc.total_records - calc.records_processed} restants</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions de contrôle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-500" />
            Actions de Contrôle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Démarrer
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <StopCircle className="w-4 h-4" />
              Arrêter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Redémarrer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}