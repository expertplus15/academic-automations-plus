import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useOptimizedCalculations } from '@/hooks/useOptimizedCalculations';
import { useCalculationMonitoring } from '@/hooks/useCalculationMonitoring';

export function CalculationDashboard() {
  const { 
    metrics: optimizationMetrics, 
    clearCache,
    executeCalculationQueued 
  } = useOptimizedCalculations();
  
  const { 
    errors, 
    metrics: monitoringMetrics, 
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearErrors,
    performHealthCheck 
  } = useCalculationMonitoring();

  const [lastHealthCheck, setLastHealthCheck] = useState<any>(null);

  // Auto-start monitoring
  useEffect(() => {
    if (!isMonitoring) {
      startMonitoring();
    }
  }, [isMonitoring, startMonitoring]);

  const handleHealthCheck = async () => {
    const result = await performHealthCheck();
    setLastHealthCheck(result);
  };

  const getStatusColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tableau de Bord des Calculs</h2>
          <p className="text-muted-foreground">
            Monitoring et optimisation des performances
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleHealthCheck} variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Test Santé
          </Button>
          <Button onClick={clearCache} variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            Vider Cache
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Succès</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(monitoringMetrics?.successRate || 0)}`}>
              {monitoringMetrics?.successRate.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Dernières 24 heures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(optimizationMetrics?.cacheHitRate * 100).toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Optimisation mémoire
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monitoringMetrics?.averageExecutionTime.toFixed(0) || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Temps d'exécution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">File d'Attente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {optimizationMetrics?.queueStatus.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {optimizationMetrics?.queueStatus.running || 0} en cours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health Status */}
      {lastHealthCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              État du Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {lastHealthCheck.healthy ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={lastHealthCheck.healthy ? 'text-green-600' : 'text-red-600'}>
                  {lastHealthCheck.healthy ? 'Système Opérationnel' : 'Problème Détecté'}
                </span>
              </div>
              <Badge variant="outline">
                {lastHealthCheck.responseTime}ms
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Erreurs</TabsTrigger>
          <TabsTrigger value="queue">File d'Attente</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de Performance</CardTitle>
              <CardDescription>
                Analyse des performances des calculs en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {monitoringMetrics && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de Succès</span>
                      <span>{monitoringMetrics.successRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={monitoringMetrics.successRate} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux d'Erreur</span>
                      <span>{monitoringMetrics.errorRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={monitoringMetrics.errorRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{monitoringMetrics.totalCalculations}</div>
                      <div className="text-sm text-muted-foreground">Calculs Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{monitoringMetrics.averageExecutionTime.toFixed(0)}ms</div>
                      <div className="text-sm text-muted-foreground">Temps Moyen</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Journal des Erreurs</CardTitle>
                <CardDescription>
                  Historique des erreurs de calcul
                </CardDescription>
              </div>
              <Button onClick={clearErrors} variant="outline" size="sm">
                Effacer
              </Button>
            </CardHeader>
            <CardContent>
              {errors.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  Aucune erreur récente
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {errors.slice(0, 10).map((error) => (
                    <div key={error.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{error.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {error.timestamp.toLocaleString()} • {error.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>État de la File d'Attente</CardTitle>
              <CardDescription>
                Gestion des calculs en cours et en attente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {optimizationMetrics?.queueStatus && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {optimizationMetrics.queueStatus.pending}
                      </div>
                      <div className="text-sm text-muted-foreground">En Attente</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {optimizationMetrics.queueStatus.running}
                      </div>
                      <div className="text-sm text-muted-foreground">En Cours</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {optimizationMetrics.queueStatus.total}
                      </div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>

                  {optimizationMetrics.queueStatus.total > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>
                          {optimizationMetrics.queueStatus.running}/{optimizationMetrics.queueStatus.total}
                        </span>
                      </div>
                      <Progress 
                        value={(optimizationMetrics.queueStatus.running / optimizationMetrics.queueStatus.total) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion du Cache</CardTitle>
              <CardDescription>
                Optimisation et surveillance du cache des calculs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizationMetrics && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de Réussite du Cache</span>
                      <span>{(optimizationMetrics.cacheHitRate * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={optimizationMetrics.cacheHitRate * 100} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div>
                      <div className="font-medium">Cache Actif</div>
                      <div className="text-sm text-muted-foreground">
                        Améliore les performances de {(optimizationMetrics.cacheHitRate * 100).toFixed(0)}%
                      </div>
                    </div>
                    <Button onClick={clearCache} variant="outline" size="sm">
                      <Database className="w-4 h-4 mr-2" />
                      Vider
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}