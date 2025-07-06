import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Target,
  BookOpen,
  Award,
  Lightbulb,
  ChartBar
} from 'lucide-react';

export function InsightsDashboard() {
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
      recommendation: 'Maintenir les méthodes pédagogiques actuelles'
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
      recommendation: 'Organiser des séances de soutien supplémentaires'
    },
    {
      id: 3,
      type: 'opportunity',
      severity: 'success',
      title: 'Potentiel d\'excellence en Informatique M1',
      description: '78% des étudiants dépassent les objectifs définis',
      impact: 'positive',
      confidence: 95,
      affectedStudents: 67,
      recommendation: 'Proposer des projets avancés aux meilleurs éléments'
    },
    {
      id: 4,
      type: 'risk',
      severity: 'error',
      title: 'Risque d\'échec élevé en Chimie L1',
      description: '34% des étudiants sous le seuil de validation',
      impact: 'negative',
      confidence: 91,
      affectedStudents: 124,
      recommendation: 'Mettre en place un plan de rattrapage immédiat'
    }
  ]);

  const analyticsData = {
    averageGrowth: 8.5,
    riskStudents: 342,
    excellenceRate: 23.7,
    retentionRate: 94.2,
    successPrediction: 87.3,
    interventionNeeded: 15
  };

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
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-50';
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

  const getImpactIcon = (impact: string) => {
    return impact === 'positive' ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold">+{analyticsData.averageGrowth}%</p>
                <p className="text-xs text-muted-foreground">Croissance moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{analyticsData.riskStudents}</p>
                <p className="text-xs text-muted-foreground">Étudiants à risque</p>
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
                <p className="text-xl font-bold">{analyticsData.excellenceRate}%</p>
                <p className="text-xs text-muted-foreground">Taux excellence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{analyticsData.retentionRate}%</p>
                <p className="text-xs text-muted-foreground">Rétention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{analyticsData.successPrediction}%</p>
                <p className="text-xs text-muted-foreground">Prédiction succès</p>
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
                <p className="text-xl font-bold">{analyticsData.interventionNeeded}</p>
                <p className="text-xs text-muted-foreground">Interventions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Insights Pédagogiques</h3>
            <Badge variant="secondary">{insights.length} insights actifs</Badge>
          </div>
          
          <div className="grid gap-4">
            {insights.map(insight => (
              <Card key={insight.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getInsightColor(insight.severity)}`}>
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
                        {getImpactIcon(insight.impact)}
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{insight.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium">Confiance</label>
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
                          <label className="text-sm font-medium">Type</label>
                          <p className="text-sm capitalize">{insight.type}</p>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-sm">Recommandation</span>
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

        <TabsContent value="predictions" className="space-y-4">
          <h3 className="text-lg font-semibold">Modèles Prédictifs</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Prédiction de Réussite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Taux de réussite prédit</span>
                      <span className="font-bold">{analyticsData.successPrediction}%</span>
                    </div>
                    <Progress value={analyticsData.successPrediction} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Basé sur les performances actuelles et historiques
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Détection Précoce de Risques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Étudiants identifiés</span>
                      <span className="font-bold text-red-600">{analyticsData.riskStudents}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Probabilité élevée de difficultés académiques
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <h3 className="text-lg font-semibold">Recommandations Personnalisées</h3>
          
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Renforcer les fondamentaux</h4>
                    <p className="text-muted-foreground mb-3">
                      Les étudiants de L1 Mathématiques montrent des lacunes en algèbre de base.
                    </p>
                    <Badge variant="outline">Priorité: Élevée</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Groupes de travail collaboratif</h4>
                    <p className="text-muted-foreground mb-3">
                      Former des groupes hétérogènes pour améliorer l'entraide entre étudiants.
                    </p>
                    <Badge variant="outline">Priorité: Moyenne</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Analytics Avancés</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="w-5 h-5" />
                  Tendances de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <ChartBar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Graphiques de tendances à venir</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Analyse Comparative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Comparaisons inter-programmes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}