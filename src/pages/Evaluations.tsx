import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { EvaluationsModuleSidebar } from '@/components/EvaluationsModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Grid, 
  Calculator, 
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle,
  FileText,
  Zap,
  RefreshCw,
  Award,
  Activity,
  Target
} from 'lucide-react';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Evaluations() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, loading, error, refreshStats, recentGrades, evaluationTypes } = useEvaluationsData();

  const evaluationStats = [
    {
      label: "Notes saisies",
      value: stats.totalGrades.toString(),
      change: `+${stats.gradesThisWeek} cette semaine`,
      changeType: "positive" as const,
      icon: BarChart3,
      trend: [65, 78, 82, 94, stats.totalGrades],
      color: "blue"
    },
    {
      label: "Sessions matricielles",
      value: stats.activeMatrixSessions.toString(),
      change: "Collaboratif temps réel",
      changeType: "positive" as const,
      icon: Grid,
      trend: [5, 8, 12, 15, stats.activeMatrixSessions],
      color: "green"
    },
    {
      label: "Moyennes calculées",
      value: stats.averagesCalculated.toString(),
      change: "Calcul automatique",
      changeType: "positive" as const,
      icon: Calculator,
      trend: [450, 520, 680, 750, stats.averagesCalculated],
      color: "purple"
    },
    {
      label: "En attente validation",
      value: stats.pendingValidation.toString(),
      change: stats.pendingValidation === 0 ? "Tout validé" : "À traiter",
      changeType: stats.pendingValidation === 0 ? "positive" : "warning" as const,
      icon: Clock,
      trend: [45, 38, 25, 15, stats.pendingValidation],
      color: "orange"
    }
  ];

  const getIcon = (IconComponent: React.ElementType, color: string) => {
    const colorClasses = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100", 
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100"
    };
    return (
      <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
        <IconComponent className="w-6 h-6" />
      </div>
    );
  };

  const handleMatrixSession = () => {
    navigate('/evaluations/matrix');
    toast({
      title: "Interface Matricielle",
      description: "Ouverture de l'interface collaborative...",
    });
  };

  if (loading) {
    return (
      <ModuleLayout sidebar={<EvaluationsModuleSidebar />}>
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<EvaluationsModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header avec actions rapides */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Évaluations</h1>
              <p className="text-muted-foreground text-lg mt-1">Interface matricielle collaborative et bulletins ultra-rapides</p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleMatrixSession}
              >
                <Grid className="w-4 h-4 mr-2" />
                Interface Matricielle
              </Button>
              <Button variant="outline" onClick={() => navigate('/evaluations/types')}>
                <Calculator className="w-4 h-4 mr-2" />
                Types d'Évaluations
              </Button>
              <Button variant="outline" onClick={() => navigate('/evaluations/analytics')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" onClick={refreshStats} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Actualisation...' : 'Actualiser'}
              </Button>
            </div>
          </div>
          
          {/* Stats Cards avec tendances */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {evaluationStats.map((stat, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      </div>
                    </div>
                    {getIcon(stat.icon, stat.color)}
                   </div>
                   {/* Mini graphique de tendance */}
                   <div className="mt-4 h-8 flex items-end gap-1">
                     {stat.trend.map((value, i) => (
                       <div 
                         key={i}
                         className={`flex-1 rounded-sm opacity-60 group-hover:opacity-100 transition-opacity ${
                           stat.color === 'blue' ? 'bg-blue-500' :
                           stat.color === 'green' ? 'bg-green-500' :
                           stat.color === 'purple' ? 'bg-purple-500' :
                           'bg-orange-500'
                         }`}
                         style={{ height: `${(value / Math.max(...stat.trend)) * 100}%` }}
                       />
                     ))}
                   </div>
                 </CardContent>
               </Card>
            ))}
          </div>
        </div>

        {/* Alerte validation en attente */}
        {stats.pendingValidation > 0 && (
          <Card className="bg-yellow-50 border-yellow-200 rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900">
                    {stats.pendingValidation} Note(s) en Attente de Validation
                  </h3>
                  <p className="text-yellow-700">
                    Des notes nécessitent une validation avant publication
                  </p>
                </div>
                <Button 
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => navigate('/evaluations/validation')}
                >
                  Valider Maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interface Matricielle Collaborative */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Interface Matricielle Collaborative
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-primary/5 rounded-xl">
                <Grid className="w-12 h-12 mx-auto text-primary mb-3" />
                <h3 className="font-semibold mb-2">Édition Simultanée</h3>
                <p className="text-sm text-muted-foreground">Type Google Sheets pour les notes</p>
                <Badge className="mt-2">{stats.activeMatrixSessions} sessions actives</Badge>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Zap className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Calculs Auto</h3>
                <p className="text-sm text-muted-foreground">Moyennes et ECTS temps réel</p>
                <Badge variant="secondary" className="mt-2">100% fiabilité</Badge>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Users className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Multi-utilisateurs</h3>
                <p className="text-sm text-muted-foreground">Collaboration temps réel</p>
                <Badge variant="outline" className="mt-2">∞ utilisateurs</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activités récentes */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Activités Récentes ({recentGrades.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentGrades.length > 0 ? (
                  <div className="space-y-4">
                    {recentGrades.slice(0, 6).map((grade) => (
                      <div
                        key={grade.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{grade.student_name}</p>
                            <p className="text-sm text-muted-foreground">{grade.evaluation_type}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={grade.is_published ? "default" : "secondary"}>
                              {grade.is_published ? "Publié" : "Brouillon"}
                            </Badge>
                          </div>
                          <div className="text-lg font-medium">
                            {grade.grade !== null ? `${grade.grade}/${grade.max_grade}` : "Non noté"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune note récente</p>
                    <p className="text-sm">Commencez par utiliser l'interface matricielle</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={() => navigate('/evaluations/matrix')}
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Interface Matricielle</p>
                      <p className="text-xs text-muted-foreground">Saisie collaborative</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={() => navigate('/evaluations/calculations')}
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Calculs Automatiques</p>
                      <p className="text-xs text-muted-foreground">Moyennes et ECTS</p>
                    </div>
                  </div>
                </button>

                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={() => navigate('/evaluations/reports')}
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Bulletins Express</p>
                      <p className="text-xs text-muted-foreground">Génération &lt; 3s</p>
                    </div>
                  </div>
                </button>

                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={() => navigate('/evaluations/analytics')}
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Analytics Avancées</p>
                      <p className="text-xs text-muted-foreground">Tendances et stats</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Types d'évaluations actifs */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Types d'Évaluations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {evaluationTypes.length > 0 ? (
                  evaluationTypes.slice(0, 4).map((type) => (
                    <div key={type.id} className="p-3 bg-muted/20 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{type.name}</p>
                          <p className="text-xs text-muted-foreground">{type.code}</p>
                        </div>
                        <Badge variant="secondary">{type.weight_percentage}%</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun type configuré</p>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => navigate('/evaluations/types')}
                >
                  Gérer les Types
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}