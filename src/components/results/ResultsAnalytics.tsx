import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  overview: {
    totalStudents: number;
    averageGrade: number;
    passRate: number;
    excellenceRate: number;
  };
  trends: Array<{
    period: string;
    average: number;
    passRate: number;
  }>;
  subjects: Array<{
    name: string;
    average: number;
    passRate: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  mentions: Array<{
    label: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  alerts: Array<{
    type: 'warning' | 'error' | 'info';
    title: string;
    description: string;
    count: number;
  }>;
}

export function ResultsAnalytics() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData>({
    overview: {
      totalStudents: 156,
      averageGrade: 13.45,
      passRate: 87.2,
      excellenceRate: 23.7
    },
    trends: [
      { period: 'S1 2023', average: 12.8, passRate: 82.1 },
      { period: 'S2 2023', average: 13.2, passRate: 85.4 },
      { period: 'S1 2024', average: 13.45, passRate: 87.2 }
    ],
    subjects: [
      { name: 'Mathématiques', average: 12.3, passRate: 78.5, difficulty: 'hard' },
      { name: 'Physique', average: 13.8, passRate: 89.2, difficulty: 'medium' },
      { name: 'Chimie', average: 14.2, passRate: 92.1, difficulty: 'easy' },
      { name: 'Informatique', average: 15.1, passRate: 94.3, difficulty: 'easy' },
      { name: 'Français', average: 13.1, passRate: 86.7, difficulty: 'medium' }
    ],
    mentions: [
      { label: 'Très Bien', count: 37, percentage: 23.7, color: '#4caf50' },
      { label: 'Bien', count: 42, percentage: 26.9, color: '#2196f3' },
      { label: 'Assez Bien', count: 35, percentage: 22.4, color: '#ff9800' },
      { label: 'Passable', count: 22, percentage: 14.1, color: '#9e9e9e' },
      { label: 'Ajourné', count: 20, percentage: 12.8, color: '#f44336' }
    ],
    alerts: [
      {
        type: 'warning',
        title: 'Taux d\'échec élevé',
        description: 'Mathématiques - 21.5% d\'échec',
        count: 33
      },
      {
        type: 'info',
        title: 'Progression positive',
        description: 'Amélioration de 2.1% ce semestre',
        count: 1
      },
      {
        type: 'error',
        title: 'Notes manquantes',
        description: '12 étudiants sans notes complètes',
        count: 12
      }
    ]
  });
  const { toast } = useToast();

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Données actualisées",
        description: "Les statistiques ont été mises à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-orange-100 text-orange-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile'
    };
    return labels[difficulty as keyof typeof labels];
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const exportReport = () => {
    toast({
      title: "Export en cours",
      description: "Le rapport d'analyse va être téléchargé",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analyse & Contrôle</h2>
          <p className="text-muted-foreground">Statistiques avancées et validation des données académiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleRefresh} disabled={loading} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{data.overview.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Étudiants Analysés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{data.overview.averageGrade}/20</div>
                <div className="text-sm text-muted-foreground">Moyenne Générale</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{data.overview.passRate}%</div>
                <div className="text-sm text-muted-foreground">Taux de Réussite</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{data.overview.excellenceRate}%</div>
                <div className="text-sm text-muted-foreground">Excellence (≥16)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
          <TabsTrigger value="subjects">Par Matière</TabsTrigger>
          <TabsTrigger value="trends">Évolution</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mentions Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Mentions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.mentions.map((mention) => (
                    <div key={mention.label} className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: mention.color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{mention.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {mention.count} ({mention.percentage}%)
                          </span>
                        </div>
                        <Progress value={mention.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Alertes et Contrôles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground">{alert.description}</div>
                      </div>
                      <Badge variant="outline">{alert.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* By Subject */}
        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Performance par Matière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.subjects.map((subject) => (
                  <div key={subject.name} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{subject.name}</h3>
                        <Badge className={getDifficultyColor(subject.difficulty)}>
                          {getDifficultyLabel(subject.difficulty)}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Moyenne: <span className="font-semibold text-foreground">{subject.average.toFixed(1)}/20</span>
                        </span>
                        <span className="text-muted-foreground">
                          Réussite: <span className="font-semibold text-green-600">{subject.passRate.toFixed(1)}%</span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Moyenne</div>
                        <Progress value={(subject.average / 20) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Taux de réussite</div>
                        <Progress value={subject.passRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-4">Tendance des Moyennes</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {data.trends.map((trend, index) => (
                      <div key={trend.period} className="text-center p-3 bg-background rounded border">
                        <div className="text-lg font-bold text-primary">{trend.average.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">{trend.period}</div>
                        <div className="text-xs text-green-600">{trend.passRate.toFixed(1)}% réussite</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-800">Analyse de Tendance</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Amélioration constante des performances avec une progression de +0.65 points 
                    de moyenne et +5.1% de taux de réussite sur les 3 derniers semestres.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation */}
        <TabsContent value="validation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contrôles de Cohérence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-800">Notes dans le barème</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">100%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-800">Notes manquantes</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">7.7%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">Calculs vérifiés</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">100%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions Recommandées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-orange-200 rounded-lg">
                    <div className="font-medium text-orange-800">Rattrapage Mathématiques</div>
                    <div className="text-sm text-orange-600">
                      33 étudiants éligibles au rattrapage
                    </div>
                    <Button size="sm" className="mt-2">Organiser</Button>
                  </div>
                  
                  <div className="p-3 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-800">Saisie de notes</div>
                    <div className="text-sm text-blue-600">
                      12 étudiants sans notes complètes
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">Relancer</Button>
                  </div>
                  
                  <div className="p-3 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-800">Validation finale</div>
                    <div className="text-sm text-green-600">
                      Prêt pour publication des résultats
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">Valider</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}