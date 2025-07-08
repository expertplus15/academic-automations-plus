import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Award,
  Clock,
  BarChart3,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useTeacherProfiles } from '@/hooks/hr/useTeacherProfiles';
import { useTeacherContracts } from '@/hooks/hr/useTeacherContracts';
import { usePerformanceEvaluations } from '@/hooks/usePerformanceEvaluations';

export function HRAnalyticsDashboard() {
  const { teacherProfiles } = useTeacherProfiles();
  const { contracts } = useTeacherContracts();
  const { evaluations } = usePerformanceEvaluations();
  const [timeRange, setTimeRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const analyticsData = {
    totalTeachers: teacherProfiles.length,
    activeTeachers: teacherProfiles.filter(t => t.status === 'active').length,
    onLeaveTeachers: teacherProfiles.filter(t => t.status === 'on_leave').length,
    averageExperience: teacherProfiles.reduce((acc, t) => acc + (t.years_experience || 0), 0) / teacherProfiles.length || 0,
    contractsExpiring: contracts.filter(c => {
      if (!c.end_date) return false;
      const endDate = new Date(c.end_date);
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return endDate <= thirtyDaysFromNow && endDate > now;
    }).length,
    avgPerformanceScore: evaluations.reduce((acc, e) => acc + (e.overall_score || 0), 0) / evaluations.length || 0,
    performanceDistribution: {
      excellent: evaluations.filter(e => e.overall_score >= 4.5).length,
      good: evaluations.filter(e => e.overall_score >= 3.5 && e.overall_score < 4.5).length,
      average: evaluations.filter(e => e.overall_score >= 2.5 && e.overall_score < 3.5).length,
      needsImprovement: evaluations.filter(e => e.overall_score < 2.5).length,
    }
  };

  const contractTypeDistribution = contracts.reduce((acc, contract) => {
    acc[contract.contract_type] = (acc[contract.contract_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentDistribution = teacherProfiles.reduce((acc, teacher) => {
    const dept = teacher.department_id || 'Non assigné';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics RH</h1>
          <p className="text-muted-foreground mt-1">Tableau de bord analytique des ressources humaines</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 jours</SelectItem>
              <SelectItem value="month">30 jours</SelectItem>
              <SelectItem value="quarter">3 mois</SelectItem>
              <SelectItem value="year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Enseignants</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.totalTeachers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+5% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enseignants Actifs</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.activeTeachers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+2% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contrats à Expirer</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.contractsExpiring}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-orange-600">Attention requise</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score Performance Moyen</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.avgPerformanceScore.toFixed(1)}/5</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+0.3 points</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="contracts">Contrats</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Distribution */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Distribution des Performances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Excellent (4.5+)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${(analyticsData.performanceDistribution.excellent / evaluations.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analyticsData.performanceDistribution.excellent}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bon (3.5-4.5)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${(analyticsData.performanceDistribution.good / evaluations.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analyticsData.performanceDistribution.good}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Moyen (2.5-3.5)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500"
                          style={{ width: `${(analyticsData.performanceDistribution.average / evaluations.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analyticsData.performanceDistribution.average}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">À améliorer (moins de 2.5)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500"
                          style={{ width: `${(analyticsData.performanceDistribution.needsImprovement / evaluations.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analyticsData.performanceDistribution.needsImprovement}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Types */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Types de Contrats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(contractTypeDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle>Évaluations de Performance Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluations.slice(0, 10).map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium">{evaluation.teacher_profile?.profile?.full_name || 'Enseignant'}</p>
                      <p className="text-sm text-muted-foreground">
                        Évalué le {new Date(evaluation.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{evaluation.overall_score}/5</p>
                        <p className="text-xs text-muted-foreground">Score global</p>
                      </div>
                      <Badge 
                        className={
                          evaluation.overall_score >= 4.5 ? 'bg-green-100 text-green-700' :
                          evaluation.overall_score >= 3.5 ? 'bg-blue-100 text-blue-700' :
                          evaluation.overall_score >= 2.5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }
                      >
                        {evaluation.overall_score >= 4.5 ? 'Excellent' :
                         evaluation.overall_score >= 3.5 ? 'Bon' :
                         evaluation.overall_score >= 2.5 ? 'Moyen' : 'À améliorer'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle>Alertes Contrats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts
                  .filter(c => {
                    if (!c.end_date) return false;
                    const endDate = new Date(c.end_date);
                    const now = new Date();
                    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
                    return endDate <= sixtyDaysFromNow && endDate > now;
                  })
                  .map((contract) => {
                    const endDate = new Date(contract.end_date!);
                    const now = new Date();
                    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={contract.id} className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50">
                        <div>
                          <p className="font-medium">{contract.teacher_profile?.profile?.full_name || 'Enseignant'}</p>
                          <p className="text-sm text-muted-foreground">
                            Contrat {contract.contract_type} expire le {endDate.toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge 
                          className={
                            daysRemaining <= 7 ? 'bg-red-100 text-red-700' :
                            daysRemaining <= 30 ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle>Répartition par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(departmentDistribution).map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <span className="font-medium">{dept}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(count / teacherProfiles.length) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary">{count} enseignant{count > 1 ? 's' : ''}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}