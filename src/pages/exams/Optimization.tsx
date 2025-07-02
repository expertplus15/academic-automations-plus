import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Zap, 
  Target,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Cpu
} from 'lucide-react';

export default function ExamsOptimization() {
  const optimizationStatus = {
    active: true,
    lastRun: "Il y a 5 minutes",
    nextRun: "Dans 25 minutes",
    efficiency: 94.2,
    conflictsResolved: 15,
    roomOptimization: 87.5
  };

  const algorithms = [
    {
      name: "Algorithme génétique",
      status: "active",
      efficiency: 96,
      description: "Optimisation globale des créneaux",
      lastUpdate: "2 min"
    },
    {
      name: "Contraintes dynamiques",
      status: "active", 
      efficiency: 89,
      description: "Respect des préférences enseignants",
      lastUpdate: "1 min"
    },
    {
      name: "Prédiction de charge",
      status: "learning",
      efficiency: 78,
      description: "Apprentissage des patterns",
      lastUpdate: "30 sec"
    },
    {
      name: "Anti-conflit temps réel",
      status: "monitoring",
      efficiency: 99,
      description: "Surveillance continue",
      lastUpdate: "temps réel"
    }
  ];

  const optimizationMetrics = [
    { label: "Utilisation salles", current: 87, target: 95, unit: "%" },
    { label: "Conflits résolus", current: 15, target: 20, unit: "" },
    { label: "Temps de calcul", current: 2.4, target: 3.0, unit: "min" },
    { label: "Satisfaction", current: 4.8, target: 5.0, unit: "/5" }
  ];

  const recentOptimizations = [
    {
      time: "14:32",
      action: "Résolution conflit salle",
      details: "Amphi A - Maths vs Physique",
      status: "resolved",
      impact: "2 examens repositionnés"
    },
    {
      time: "14:15",
      action: "Optimisation créneaux",
      details: "Bloc informatique semaine 3",
      status: "completed",
      impact: "5% amélioration utilisation"
    },
    {
      time: "13:58",
      action: "Attribution surveillant",
      details: "Remplacement automatique",
      status: "completed",
      impact: "Continuité assurée"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><Play className="w-3 h-3 mr-1" />Actif</Badge>;
      case 'learning':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Activity className="w-3 h-3 mr-1" />Apprentissage</Badge>;
      case 'monitoring':
        return <Badge className="bg-violet-100 text-violet-700 border-violet-200"><Bot className="w-3 h-3 mr-1" />Surveillance</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Résolu</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <ExamsModuleLayout 
      title="Optimisation IA"
      subtitle="Algorithmes intelligents et optimisation automatique en temps réel"
    >
      <div className="p-8 space-y-8">
        {/* Status général */}
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-600 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-violet-900">
                    Système d'optimisation IA
                  </h3>
                  <p className="text-violet-700">
                    {optimizationStatus.active ? 'Actif' : 'Inactif'} • Efficacité: {optimizationStatus.efficiency}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurer
                </Button>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimiser maintenant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="flex gap-4">
          <Button className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" />
            Démarrer optimisation
          </Button>
          <Button variant="outline">
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        {/* Métriques de performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {optimizationMetrics.map((metric, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.current}{metric.unit}
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(metric.current / metric.target) * 100} 
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-muted-foreground">
                      {((metric.current / metric.target) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="algorithms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="algorithms">Algorithmes</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {algorithms.map((algo, index) => (
                <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{algo.name}</CardTitle>
                      {getStatusBadge(algo.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{algo.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Efficacité</span>
                        <span>{algo.efficiency}%</span>
                      </div>
                      <Progress value={algo.efficiency} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Dernière mise à jour: {algo.lastUpdate}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Cpu className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <BarChart3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-500" />
                  Optimisations récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOptimizations.map((opt, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-mono text-muted-foreground">
                          {opt.time}
                        </div>
                        <div>
                          <p className="font-medium">{opt.action}</p>
                          <p className="text-sm text-muted-foreground">{opt.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(opt.status)}
                        <p className="text-xs text-muted-foreground mt-1">{opt.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-violet-500" />
                  Configuration des algorithmes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Interface de configuration avancée</p>
                    <p className="text-sm mt-1">Paramètres des algorithmes et contraintes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ExamsModuleLayout>
  );
}