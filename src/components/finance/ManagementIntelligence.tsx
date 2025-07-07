import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target,
  AlertTriangle,
  Bot,
  BarChart3,
  DollarSign,
  Users,
  Award,
  PieChart,
  Settings,
  Zap,
  Shield,
  Database,
  TrendingDown
} from 'lucide-react';

export function ManagementIntelligence() {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [activeOptimizations] = useState(3);
  
  // Data for Contrôle de Gestion
  const kpiData = [
    {
      title: 'Revenus par étudiant',
      value: '€4,250',
      change: '+8.5%',
      trend: 'up',
      target: 4500,
      current: 4250,
      description: 'Revenus moyens générés par étudiant inscrit'
    },
    {
      title: 'Taux de recouvrement',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      target: 95,
      current: 94.2,
      description: 'Pourcentage des créances recouvrées'
    },
    {
      title: 'Coût par étudiant',
      value: '€3,850',
      change: '-3.2%',
      trend: 'down',
      target: 3500,
      current: 3850,
      description: 'Coûts moyens par étudiant (personnel, infrastructure)'
    },
    {
      title: 'Marge opérationnelle',
      value: '9.4%',
      change: '+1.8%',
      trend: 'up',
      target: 12,
      current: 9.4,
      description: 'Marge bénéficiaire sur les opérations courantes'
    }
  ];

  // Data for Intelligence IA
  const predictions = [
    {
      type: 'trésorerie',
      period: 'J+30',
      value: '2.1M€',
      confidence: 95,
      variance: '±50K€'
    },
    {
      type: 'trésorerie', 
      period: 'J+90',
      value: '1.8M€',
      confidence: 85,
      variance: '±120K€'
    },
    {
      type: 'impayés',
      period: 'Risque',
      value: '87%',
      confidence: 87,
      variance: 'précision'
    }
  ];

  const optimizations = [
    {
      id: 1,
      title: 'Optimisation placement trésorerie',
      impact: '+15K€/an',
      status: 'active',
      confidence: 92
    },
    {
      id: 2,
      title: 'Prédiction défaillances paiement',
      impact: '-25% impayés',
      status: 'active', 
      confidence: 87
    },
    {
      id: 3,
      title: 'Optimisation tarifaire formations',
      impact: '+8% revenus',
      status: 'simulation',
      confidence: 78
    }
  ];

  // Data for Analytics Multi-axes
  const revenueBreakdown = [
    { category: 'Frais de scolarité', amount: 580000, percentage: 68.2, color: 'bg-blue-500' },
    { category: 'Formations continues', amount: 120000, percentage: 14.1, color: 'bg-success' },
    { category: 'Hébergement', amount: 85000, percentage: 10.0, color: 'bg-warning' },
    { category: 'Services auxiliaires', amount: 45000, percentage: 5.3, color: 'bg-primary' },
    { category: 'Autres revenus', amount: 20000, percentage: 2.4, color: 'bg-muted' }
  ];

  const departmentPerformance = [
    { name: 'Sciences', budget: 150000, spent: 142000, efficiency: 94.7 },
    { name: 'Lettres', budget: 120000, spent: 118000, efficiency: 98.3 },
    { name: 'Économie', budget: 135000, spent: 139000, efficiency: 97.0 },
    { name: 'Informatique', budget: 180000, spent: 165000, efficiency: 91.7 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-finance" />
            Pilotage & Intelligence Financière
          </h2>
          <p className="text-muted-foreground">Contrôle de gestion, IA et analytique multi-axes</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Zap className="w-3 h-3 text-finance" />
            {activeOptimizations} optimisations actives
          </Badge>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="controle" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="controle">Contrôle de Gestion</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence IA</TabsTrigger>
          <TabsTrigger value="analytics">Analytique Multi-axes</TabsTrigger>
          <TabsTrigger value="scoring">Scoring & Risques</TabsTrigger>
        </TabsList>

        {/* CONTRÔLE DE GESTION */}
        <TabsContent value="controle" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-finance" />
                  Tableaux de Bord
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  KPIs temps réel avec alertes automatiques
                </p>
                <Button className="w-full gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Voir Dashboards
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Analyse d'Écarts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Détection automatique et analyse des dérives
                </p>
                <Button variant="outline" className="w-full gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Analyser Écarts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-success" />
                  Plans d'Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Recommandations IA et suivi des actions correctives
                </p>
                <Button variant="outline" className="w-full gap-2">
                  <Target className="w-4 h-4" />
                  Créer Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* KPIs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-finance/10 rounded-lg">
                      {index === 0 && <DollarSign className="w-5 h-5 text-finance" />}
                      {index === 1 && <Target className="w-5 h-5 text-finance" />}
                      {index === 2 && <Users className="w-5 h-5 text-finance" />}
                      {index === 3 && <TrendingUp className="w-5 h-5 text-finance" />}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.change}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">{kpi.title}</h3>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <Progress value={(kpi.current / kpi.target) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* INTELLIGENCE IA */}
        <TabsContent value="intelligence" className="space-y-6">
          {/* Dashboard IA principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-finance" />
                  IA Financière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-finance">Active</div>
                <p className="text-sm text-muted-foreground">Moteur ML opérationnel</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Précision prédictions</span>
                    <span className="font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Optimisations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{activeOptimizations}</div>
                <p className="text-sm text-muted-foreground">En cours d'exécution</p>
                <div className="mt-3 text-sm">
                  <span className="text-success font-medium">+€45K</span>
                  <span className="text-muted-foreground"> impact cumulé</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">2</div>
                <p className="text-sm text-muted-foreground">Anomalies détectées</p>
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-warning">Transaction suspecte détectée</div>
                  <div className="text-xs text-warning">Écart budgétaire inhabituel</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prédictions détaillées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-finance" />
                Prédictions Financières Avancées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {predictions.map((pred, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{pred.type}</span>
                      <Badge variant="outline">{pred.period}</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">{pred.value}</div>
                    <div className="text-sm text-muted-foreground mb-3">{pred.variance}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Confiance:</span>
                      <Progress value={pred.confidence} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{pred.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimisations en cours */}
          <Card>
            <CardHeader>
              <CardTitle>Optimisations IA en Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-finance/10 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-finance" />
                      </div>
                      <div>
                        <p className="font-medium">{opt.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Impact: {opt.impact} • Confiance: {opt.confidence}%
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={opt.status === 'active' ? 'default' : 'secondary'}
                      className={opt.status === 'active' ? 'bg-success/10 text-success border-success/20' : ''}
                    >
                      {opt.status === 'active' ? 'Actif' : 'Simulation'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTIQUE MULTI-AXES */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Sélecteur de métriques */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Button 
                  variant={selectedMetric === 'revenue' ? 'default' : 'outline'}
                  onClick={() => setSelectedMetric('revenue')}
                  className={selectedMetric === 'revenue' ? 'bg-finance hover:bg-finance/90' : ''}
                >
                  Revenus
                </Button>
                <Button 
                  variant={selectedMetric === 'costs' ? 'default' : 'outline'}
                  onClick={() => setSelectedMetric('costs')}
                >
                  Coûts
                </Button>
                <Button 
                  variant={selectedMetric === 'performance' ? 'default' : 'outline'}
                  onClick={() => setSelectedMetric('performance')}
                >
                  Performance
                </Button>
                <Button 
                  variant={selectedMetric === 'trends' ? 'default' : 'outline'}
                  onClick={() => setSelectedMetric('trends')}
                >
                  Tendances
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition des revenus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-finance" />
                  Répartition des revenus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold">€{item.amount.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground ml-2">({item.percentage}%)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <Progress value={item.percentage} className="flex-1 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance par département */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-finance" />
                  Performance par département
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentPerformance.map((dept, index) => (
                    <div key={index} className="p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{dept.name}</span>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-finance" />
                          <span className="font-bold">{dept.efficiency}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Budget alloué</p>
                          <p className="font-semibold">€{dept.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Dépensé</p>
                          <p className="font-semibold">€{dept.spent.toLocaleString()}</p>
                        </div>
                      </div>
                      <Progress value={dept.efficiency} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommandations stratégiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-finance" />
                Recommandations stratégiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-xl border-l-4 border-primary">
                  <h4 className="font-semibold text-primary mb-2">Optimisation des revenus</h4>
                  <p className="text-sm text-primary/80">
                    Augmenter les formations continues pourrait générer +€45K de revenus supplémentaires.
                  </p>
                </div>
                <div className="p-4 bg-warning/5 rounded-xl border-l-4 border-warning">
                  <h4 className="font-semibold text-warning mb-2">Contrôle des coûts</h4>
                  <p className="text-sm text-warning/80">
                    Le département Économie dépasse son budget de 3%. Révision recommandée.
                  </p>
                </div>
                <div className="p-4 bg-success/5 rounded-xl border-l-4 border-success">
                  <h4 className="font-semibold text-success mb-2">Performance</h4>
                  <p className="text-sm text-success/80">
                    Le taux de recouvrement s'améliore. Objectif 95% atteignable ce trimestre.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SCORING & RISQUES */}
        <TabsContent value="scoring" className="space-y-6">
          {/* Dashboard risques principal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <TrendingUp className="w-3 h-3" />
                    +3%
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Précision Prédictions</h3>
                  <p className="text-2xl font-bold">91%</p>
                  <p className="text-xs text-muted-foreground">Algorithmes ML optimisés</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <TrendingDown className="w-3 h-3" />
                    -5
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Clients à Risque</h3>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-xs text-muted-foreground">Surveillance active</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <TrendingUp className="w-3 h-3" />
                    +25%
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Prévention Impayés</h3>
                  <p className="text-2xl font-bold">€89K</p>
                  <p className="text-xs text-muted-foreground">Économies réalisées</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-finance/10 rounded-lg">
                    <Target className="w-5 h-5 text-finance" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <TrendingUp className="w-3 h-3" />
                    +0.3
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Score Moyen</h3>
                  <p className="text-2xl font-bold">7.2/10</p>
                  <p className="text-xs text-muted-foreground">Amélioration continue</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modules de scoring */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Modèles Prédictifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Algorithmes ML pour prédire les risques d'impayés
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Modèle Random Forest</span>
                    <span className="font-medium text-success">Active</span>
                  </div>
                  <Progress value={91} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Dernière MAJ</span>
                    <span className="text-muted-foreground">Il y a 2h</span>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <Brain className="w-4 h-4" />
                  Entraîner Modèle
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Indicateurs Avancés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Variables comportementales et financières en temps réel
                </p>
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Historique paiements</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Comportement financier</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Shield className="w-4 h-4" />
                  Configurer Indicateurs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-success" />
                  Actions Préventives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Recommandations automatiques basées sur les scores
                </p>
                <div className="space-y-2 mb-4">
                  <div className="text-xs bg-warning/10 text-warning p-2 rounded">
                    3 clients nécessitent un suivi rapproché
                  </div>
                  <div className="text-xs bg-destructive/10 text-destructive p-2 rounded">
                    1 client en situation critique
                  </div>
                  <div className="text-xs bg-success/10 text-success p-2 rounded">
                    12 actions préventives en cours
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Target className="w-4 h-4" />
                  Voir Actions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analyse des risques détaillée */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-finance" />
                Analyse des Risques par Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Répartition par niveau de risque</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">Risque faible</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">847</span>
                        <span className="text-xs text-muted-foreground ml-2">(78%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>
                        <span className="text-sm">Risque modéré</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">185</span>
                        <span className="text-xs text-muted-foreground ml-2">(17%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <span className="text-sm">Risque élevé</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">23</span>
                        <span className="text-xs text-muted-foreground ml-2">(2%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
                        <span className="text-sm">Risque critique</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">8</span>
                        <span className="text-xs text-muted-foreground ml-2">(1%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Impact financier estimé</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/5 rounded-lg border-l-4 border-success">
                      <div className="font-medium text-success">Prévention réussie</div>
                      <div className="text-sm text-success/80">€89,400 d'impayés évités ce mois</div>
                    </div>
                    <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-warning">
                      <div className="font-medium text-warning">Sous surveillance</div>
                      <div className="text-sm text-warning/80">€125,600 en cours de traitement</div>
                    </div>
                    <div className="p-3 bg-destructive/5 rounded-lg border-l-4 border-destructive">
                      <div className="font-medium text-destructive">Action urgente</div>
                      <div className="text-sm text-destructive/80">€34,200 nécessitent intervention</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}