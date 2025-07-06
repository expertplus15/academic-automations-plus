import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Target,
  Award,
  Lightbulb,
  ChartBar,
  BarChart3,
  BookOpen,
  Zap,
  RefreshCw,
  Settings
} from 'lucide-react';

export function AnalyticsInsightsDashboard() {
  const [insights] = useState([
    {
      id: 1,
      type: 'trend',
      severity: 'info',
      title: 'Amélioration des performances en Mathématiques L1',
      description: 'Les moyennes ont augmenté de 15% par rapport au semestre précédent',
      impact: 'positive',
      confidence: 92,
      affectedStudents: 156,
      recommendation: 'Maintenir les méthodes pédagogiques actuelles',
      priority: 'medium'
    },
    {
      id: 2,
      type: 'alert',
      severity: 'warning',
      title: 'Baisse significative en Physique L2',
      description: 'Diminution de 23% des notes moyennes sur les 3 dernières semaines',
      impact: 'negative',
      confidence: 87,
      affectedStudents: 89,
      recommendation: 'Organiser des séances de soutien supplémentaires',
      priority: 'high'
    },
    {
      id: 3,
      type: 'risk',
      severity: 'error',
      title: 'Risque d\'échec élevé en Chimie L1',
      description: '34% des étudiants sous le seuil de validation',
      impact: 'negative',
      confidence: 91,
      affectedStudents: 124,
      recommendation: 'Mettre en place un plan de rattrapage immédiat',
      priority: 'critical'
    },
    {
      id: 4,
      type: 'opportunity',
      severity: 'success',
      title: 'Potentiel d\'excellence en Informatique M1',
      description: '78% des étudiants dépassent les objectifs définis',
      impact: 'positive',
      confidence: 95,
      affectedStudents: 67,
      recommendation: 'Proposer des projets avancés aux meilleurs éléments',
      priority: 'low'
    }
  ]);

  const [metricsData] = useState({
    studentsTracked: 1247,
    studentsGrowth: 12,
    averageGrade: 14.2,
    gradeImprovement: 0.3,
    successRate: 87.3,
    successImprovement: 2.1,
    excellentMentions: 156,
    excellentPercentage: 12.5,
    riskStudents: 342,
    excellenceRate: 23.7,
    retentionRate: 94.2,
    successPrediction: 87.3,
    interventionsNeeded: 15,
    averageGrowthRate: 8.5
  });

  const [programs] = useState([
    {
      name: 'Master Management',
      students: 156,
      average: 15.2,
      successRate: 92,
      status: 'excellent',
      trend: 'up',
      riskLevel: 'low'
    },
    {
      name: 'Licence Commerce',
      students: 89,
      average: 13.8,
      successRate: 85,
      status: 'good',
      trend: 'stable',
      riskLevel: 'medium'
    },
    {
      name: 'BTS Gestion',
      students: 67,
      average: 12.1,
      successRate: 78,
      status: 'attention',
      trend: 'down',
      riskLevel: 'high'
    }
  ]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'opportunity':
        return <Target className="w-5 h-5" />;
      case 'risk':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critique</Badge>;
      case 'high':
        return <Badge variant="secondary">Priorité élevée</Badge>;
      case 'medium':
        return <Badge variant="outline">Priorité moyenne</Badge>;
      case 'low':
        return <Badge variant="outline">Priorité faible</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge variant="default">Excellent</Badge>;
      case 'good':
        return <Badge variant="secondary">Bon</Badge>;
      case 'attention':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Attention</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions rapides */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-muted-foreground">Tableau de bord unifié avec intelligence artificielle</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      {/* Alertes critiques */}
      {insights.filter(i => i.priority === 'critical').length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{insights.filter(i => i.priority === 'critical').length} situation(s) critique(s)</strong> nécessitent votre attention immédiate.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métriques principales combinées */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{metricsData.studentsTracked.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">+{metricsData.studentsGrowth}% ce semestre</p>
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
                    <p className="text-2xl font-bold text-emerald-600">{metricsData.averageGrade}</p>
                    <p className="text-xs text-muted-foreground">+{metricsData.gradeImprovement} points</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">{metricsData.successRate}%</p>
                    <p className="text-xs text-muted-foreground">+{metricsData.successImprovement}%</p>
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
                    <p className="text-2xl font-bold text-red-600">{metricsData.riskStudents}</p>
                    <p className="text-xs text-muted-foreground">Étudiants à risque</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métriques IA */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{metricsData.successPrediction}%</p>
                    <p className="text-xs text-muted-foreground">Prédiction succès</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{metricsData.excellenceRate}%</p>
                    <p className="text-xs text-muted-foreground">Taux excellence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{metricsData.retentionRate}%</p>
                    <p className="text-xs text-muted-foreground">Rétention</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{metricsData.interventionsNeeded}</p>
                    <p className="text-xs text-muted-foreground">Interventions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score de santé académique global */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Score de Santé Académique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Score global</span>
                  <span className="text-3xl font-bold text-primary">87/100</span>
                </div>
                <Progress value={87} className="h-3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">Bon</p>
                    <p className="text-sm text-muted-foreground">Performance générale</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">3</p>
                    <p className="text-sm text-muted-foreground">Points d'attention</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-muted-foreground">Opportunités</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Graphiques de performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Évolution des Moyennes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-center space-x-2">
                  {[12.5, 13.2, 14.1, 14.8, 14.2, 14.6].map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500 rounded-t w-8 mb-2" 
                        style={{ height: `${(value / 20) * 160}px` }}
                      ></div>
                      <span className="text-xs text-muted-foreground">S{index + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  Répartition des Mentions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Très Bien (≥16)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bien (14-16)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Assez Bien (12-14)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Passable (10-12)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analyse par programme avec insights IA */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse par Programme avec Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programs.map((program, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{program.name}</p>
                        <p className="text-sm text-muted-foreground">{program.students} étudiants</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {program.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {program.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                        {program.trend === 'stable' && <div className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{program.average}</p>
                        <p className="text-xs text-muted-foreground">Moyenne</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{program.successRate}%</p>
                        <p className="text-xs text-muted-foreground">Réussite</p>
                      </div>
                      <div className="text-center">
                        <Badge variant={program.riskLevel === 'high' ? 'destructive' : program.riskLevel === 'medium' ? 'secondary' : 'outline'}>
                          Risque {program.riskLevel === 'high' ? 'élevé' : program.riskLevel === 'medium' ? 'modéré' : 'faible'}
                        </Badge>
                      </div>
                      {getStatusBadge(program.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Insights Pédagogiques Intelligents</h3>
            <Badge variant="secondary">{insights.length} insights actifs</Badge>
          </div>
          
          <div className="grid gap-4">
            {insights.map(insight => (
              <Card key={insight.id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getInsightColor(insight.severity)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant={getBadgeVariant(insight.severity) as any}>
                          {insight.severity === 'error' ? 'Critique' : 
                           insight.severity === 'warning' ? 'Attention' :
                           insight.severity === 'success' ? 'Opportunité' : 'Info'}
                        </Badge>
                        {getPriorityBadge(insight.priority)}
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{insight.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium">Confiance IA</label>
                          <div className="flex items-center gap-2">
                            <Progress value={insight.confidence} className="flex-1" />
                            <span className="text-sm">{insight.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Étudiants affectés</label>
                          <p className="text-lg font-bold">{insight.affectedStudents}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Impact prédit</label>
                          <div className="flex items-center gap-1">
                            {insight.impact === 'positive' ? 
                              <TrendingUp className="w-4 h-4 text-green-600" /> : 
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            }
                            <span className="text-sm capitalize">{insight.impact}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-sm">Recommandation IA</span>
                        </div>
                        <p className="text-sm">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <h3 className="text-lg font-semibold">Centre d'Actions Unifiées</h3>
          
          {/* Actions critiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Actions Critiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.filter(i => i.priority === 'critical' || i.priority === 'high').map(insight => (
                  <div key={insight.id} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">{insight.title}</p>
                      <p className="text-sm text-red-600">{insight.affectedStudents} étudiants concernés</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">Action immédiate</Button>
                      <Button size="sm" variant="outline">Planifier</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions recommandées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Actions Recommandées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">Mettre en place des séances de tutorat</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Pour les étudiants identifiés comme fragiles en Physique L2.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">Planifier tutorat</Button>
                      <Button size="sm" variant="outline">Voir détails</Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">Reproduire les bonnes pratiques</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Appliquer la méthode pédagogique du Master Management aux autres formations.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Analyser méthode</Button>
                      <Button size="sm" variant="outline">Dupliquer</Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">Proposer des projets avancés</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Pour les 67 étudiants excellents en Informatique M1.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Créer projets</Button>
                      <Button size="sm" variant="outline">Contacter étudiants</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique des actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="w-5 h-5" />
                Historique & Suivi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Tutorat Mathématiques L1</p>
                    <p className="text-sm text-green-600">Mis en place il y a 2 semaines</p>
                  </div>
                  <Badge variant="default">Succès (+15% notes)</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Réorganisation planning Informatique</p>
                    <p className="text-sm text-blue-600">En cours depuis 1 semaine</p>
                  </div>
                  <Badge variant="secondary">En cours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}