import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  Zap, 
  BarChart3, 
  Settings, 
  Play, 
  Pause,
  CheckCircle,
  Clock,
  TrendingUp,
  Brain,
  Target
} from 'lucide-react';

export function CalculationsDashboard() {
  const { toast } = useToast();
  const [calculationJobs, setCalculationJobs] = useState([
    {
      id: 1,
      name: 'Moyennes pondérées L1',
      type: 'weighted_averages',
      status: 'running',
      progress: 65,
      students: 245,
      estimatedTime: '2 min'
    },
    {
      id: 2,
      name: 'Calculs ECTS Master',
      type: 'ects_calculation',
      status: 'queued',
      progress: 0,
      students: 89,
      estimatedTime: '1 min'
    },
    {
      id: 3,
      name: 'Classements L2',
      type: 'rankings',
      status: 'completed',
      progress: 100,
      students: 156,
      estimatedTime: 'Terminé'
    }
  ]);

  const calculationStats = {
    studentsProcessed: 12450,
    averageCalculationTime: '0.15s',
    accuracyRate: 99.97,
    totalCalculations: 48670
  };

  const [calculationRules, setCalculationRules] = useState([
    {
      id: 1,
      name: 'Moyenne Arithmétique Simple',
      description: 'Calcul standard pour les évaluations égales',
      isActive: true,
      usage: 850,
      priority: 1,
      performance: { accuracy: 99.9, speed: '0.12s' }
    },
    {
      id: 2,
      name: 'Moyenne Pondérée ECTS',
      description: 'Pondération par crédits européens',
      isActive: true,
      usage: 450,
      priority: 2,
      performance: { accuracy: 99.8, speed: '0.18s' }
    },
    {
      id: 3,
      name: 'Compensation Inter-Semestre',
      description: 'Règles de compensation académique',
      isActive: true,
      usage: 230,
      priority: 3,
      performance: { accuracy: 99.5, speed: '0.25s' }
    },
    {
      id: 4,
      name: 'Bonus Assiduité',
      description: 'Points supplémentaires pour présence',
      isActive: false,
      usage: 45,
      priority: 4,
      performance: { accuracy: 98.9, speed: '0.15s' }
    },
    {
      id: 5,
      name: 'IA - Prédiction Adaptative',
      description: 'Ajustement intelligent basé sur les tendances',
      isActive: true,
      usage: 120,
      priority: 5,
      performance: { accuracy: 94.2, speed: '2.3s' }
    }
  ]);

  const [highPerformanceMode, setHighPerformanceMode] = useState(false);
  const [realTimeSync, setRealTimeSync] = useState(true);
  const [autoOptimization, setAutoOptimization] = useState(false);

  // Simulation de calculs en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setCalculationJobs(prev => prev.map(job => {
        if (job.status === 'running' && job.progress < 100) {
          const newProgress = Math.min(job.progress + Math.random() * 10, 100);
          return {
            ...job,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'running'
          };
        }
        return job;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startCalculation = useCallback((type: string) => {
    const newJob = {
      id: Date.now(),
      name: `Calcul ${type}`,
      type,
      status: 'running' as const,
      progress: 0,
      students: Math.floor(Math.random() * 300) + 50,
      estimatedTime: `${Math.floor(Math.random() * 3) + 1} min`
    };

    setCalculationJobs(prev => [newJob, ...prev]);
    
    toast({
      title: "Calcul démarré",
      description: `Traitement ${type} en cours...`,
    });
  }, [toast]);

  const toggleRule = useCallback((ruleId: number) => {
    setCalculationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
    
    toast({
      title: "Règle mise à jour",
      description: "La configuration a été sauvegardée",
    });
  }, [toast]);

  const optimizePerformance = useCallback(() => {
    setHighPerformanceMode(true);
    
    // Simuler l'optimisation
    setTimeout(() => {
      toast({
        title: "Optimisation terminée",
        description: "Performance améliorée de 23%",
      });
      
      // Mettre à jour les stats
      setCalculationJobs(prev => prev.map(job => ({
        ...job,
        estimatedTime: job.status === 'queued' ? 
          `${Math.max(1, parseInt(job.estimatedTime) - 1)} min` : 
          job.estimatedTime
      })));
    }, 2000);
  }, [toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-gray-600" />;
      default:
        return <Calculator className="w-4 h-4 text-gray-400" />;
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
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{calculationStats.studentsProcessed.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Étudiants traités</p>
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
                <p className="text-2xl font-bold">{calculationStats.averageCalculationTime}</p>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{calculationStats.accuracyRate}%</p>
                <p className="text-sm text-muted-foreground">Précision</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{calculationStats.totalCalculations.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Calculs totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="running" className="space-y-4">
        <TabsList>
          <TabsTrigger value="running">Calculs en cours</TabsTrigger>
          <TabsTrigger value="rules">Règles de calcul</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithmes IA</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="running" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Moteur de calcul haute performance</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startCalculation('Moyennes')}>
                <Calculator className="w-4 h-4 mr-2" />
                Calcul rapide
              </Button>
              <Button variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Pause tous
              </Button>
              <Button size="sm" onClick={() => startCalculation('Complet')}>
                <Play className="w-4 h-4 mr-2" />
                Nouveau calcul
              </Button>
            </div>
          </div>

          {/* Options de performance */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="high-performance"
                    checked={highPerformanceMode}
                    onCheckedChange={setHighPerformanceMode}
                  />
                  <Label htmlFor="high-performance">Mode haute performance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="real-time-sync"
                    checked={realTimeSync}
                    onCheckedChange={setRealTimeSync}
                  />
                  <Label htmlFor="real-time-sync">Synchronisation temps réel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-optimization"
                    checked={autoOptimization}
                    onCheckedChange={setAutoOptimization}
                  />
                  <Label htmlFor="auto-optimization">Optimisation automatique</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {highPerformanceMode && (
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Mode haute performance activé - Les calculs sont 3x plus rapides avec optimisation GPU.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {calculationJobs.map(job => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <h4 className="font-medium">{job.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.students} étudiants • {job.estimatedTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(job.status) as any}>
                        {job.status === 'running' ? 'En cours' : 
                         job.status === 'completed' ? 'Terminé' : 
                         job.status === 'queued' ? 'En attente' : 'Suspendu'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {job.status === 'running' ? 'Pause' : 'Démarrer'}
                      </Button>
                    </div>
                  </div>
                  
                  {job.status === 'running' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Règles de calcul</h3>
            <Button size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Nouvelle règle
            </Button>
          </div>
          
          <div className="space-y-3">
            {calculationRules.map(rule => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{rule.name}</p>
                          <Badge variant="outline" className="text-xs">
                            Priorité {rule.priority}
                          </Badge>
                          {rule.name.includes('IA') && (
                            <Badge variant="secondary" className="text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                        <div className="flex gap-4 mt-2 text-xs">
                          <span className="text-green-600">Précision: {rule.performance.accuracy}%</span>
                          <span className="text-blue-600">Vitesse: {rule.performance.speed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{rule.usage} utilisations</p>
                        <p className="text-xs text-muted-foreground">Cette année</p>
                        <div className="text-xs text-green-600 mt-1">
                          +{Math.floor(rule.usage * 0.12)} ce mois
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant={rule.isActive ? "outline" : "default"} 
                          size="sm"
                          onClick={() => toggleRule(rule.id)}
                        >
                          {rule.isActive ? "Désactiver" : "Activer"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-4">
          <h3 className="text-lg font-semibold">Algorithmes d'Intelligence Artificielle</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  Prédiction de Réussite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Algorithme ML pour prédire les risques d'échec et suggérer des interventions
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Précision du modèle</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <Progress value={94.2} />
                </div>
                <Button size="sm" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Exécuter analyse
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Optimisation Notation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Suggestions automatiques d'ajustements de barème basées sur l'historique
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Optimisations suggérées</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Gain moyen estimé</span>
                    <span className="font-medium text-green-600">+0.8 pts</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Voir suggestions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration générale</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de calcul</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Échelle de notation</label>
                  <p className="text-sm text-muted-foreground">Actuellement: 0-20</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Note de passage</label>
                  <p className="text-sm text-muted-foreground">Actuellement: 10/20</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Arrondi</label>
                  <p className="text-sm text-muted-foreground">Actuellement: 2 décimales</p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Calculs simultanés</label>
                  <p className="text-sm text-muted-foreground">Actuellement: 4</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Cache des résultats</label>
                  <p className="text-sm text-muted-foreground">Activé (24h)</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Mode haute performance</label>
                  <p className="text-sm text-muted-foreground">Désactivé</p>
                </div>
                <Button variant="outline" onClick={optimizePerformance}>
                  <Settings className="w-4 h-4 mr-2" />
                  Optimiser maintenant
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring & Alertes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Seuil d'alerte performance</label>
                  <p className="text-sm text-muted-foreground">Alerte si calcul {'>'}5s</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Sauvegarde automatique</label>
                  <p className="text-sm text-muted-foreground">Toutes les 30 secondes</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Cache intelligent</label>
                  <p className="text-sm text-muted-foreground">Résultats fréquents en mémoire</p>
                </div>
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Configurer alertes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}