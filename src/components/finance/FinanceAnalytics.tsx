import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  monthlyGrowth: number;
  collectionEfficiency: number;
  cashFlowHealth: 'excellent' | 'good' | 'warning' | 'critical';
  predictions: {
    nextMonthRevenue: number;
    collectionRisk: number;
    optimalCashFlow: number;
  };
  kpis: {
    dso: number; // Days Sales Outstanding
    conversionRate: number;
    customerLifetimeValue: number;
    churnRate: number;
  };
}

interface FinanceAnalyticsProps {
  data: AnalyticsData;
  loading?: boolean;
}

export function FinanceAnalytics({ data, loading = false }: FinanceAnalyticsProps) {
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="bg-card animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return CheckCircle;
      case 'good': return Target;
      case 'warning': return Clock;
      case 'critical': return AlertCircle;
      default: return Activity;
    }
  };

  const HealthIcon = getHealthIcon(data.cashFlowHealth);

  return (
    <div className="space-y-6">
      {/* Analytics intelligents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Croissance mensuelle */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Croissance</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {data.monthlyGrowth > 0 ? '+' : ''}{data.monthlyGrowth.toFixed(1)}%
                  </span>
                  {data.monthlyGrowth > 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>
              <div className={`p-2 rounded-lg ${
                data.monthlyGrowth > 0 ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                <Activity className={`w-4 h-4 ${
                  data.monthlyGrowth > 0 ? 'text-success' : 'text-destructive'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Efficacité de recouvrement */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Efficacité</p>
                <span className="text-sm font-semibold">{data.collectionEfficiency}%</span>
              </div>
              <Progress value={data.collectionEfficiency} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.collectionEfficiency > 80 ? 'Excellent' : 
                 data.collectionEfficiency > 60 ? 'Bon' : 'À améliorer'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Santé financière */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Santé financière</p>
                <Badge 
                  variant="outline" 
                  className={`mt-1 ${getHealthColor(data.cashFlowHealth)}`}
                >
                  <HealthIcon className="w-3 h-3 mr-1" />
                  {data.cashFlowHealth === 'excellent' && 'Excellente'}
                  {data.cashFlowHealth === 'good' && 'Bonne'}
                  {data.cashFlowHealth === 'warning' && 'Attention'}
                  {data.cashFlowHealth === 'critical' && 'Critique'}
                </Badge>
              </div>
              <HealthIcon className={`w-8 h-8 ${getHealthColor(data.cashFlowHealth)}`} />
            </div>
          </CardContent>
        </Card>

        {/* DSO - Days Sales Outstanding */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">DSO</p>
                <span className="text-2xl font-bold">{data.kpis.dso}j</span>
                <p className="text-xs text-muted-foreground">Délai de paiement</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prédictions intelligentes */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-finance" />
            Prédictions & Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prévision revenus */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Revenus prévus (mois prochain)</span>
              </div>
              <p className="text-2xl font-bold text-success">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR',
                  notation: 'compact'
                }).format(data.predictions.nextMonthRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Basé sur les tendances actuelles
              </p>
            </div>

            {/* Risque de recouvrement */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Risque de recouvrement</span>
              </div>
              <div className="space-y-1">
                <Progress value={data.predictions.collectionRisk} className="h-2" />
                <p className="text-sm font-semibold">
                  {data.predictions.collectionRisk}% de risque
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {data.predictions.collectionRisk > 30 ? 
                  'Actions de relance recommandées' : 
                  'Situation sous contrôle'}
              </p>
            </div>

            {/* Cash-flow optimal */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Cash-flow optimal</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR',
                  notation: 'compact'
                }).format(data.predictions.optimalCashFlow)}
              </p>
              <p className="text-xs text-muted-foreground">
                Objectif atteignable ce trimestre
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs avancés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{data.kpis.conversionRate}%</span>
                <Badge variant="outline" className="text-xs">
                  {data.kpis.conversionRate > 75 ? 'Excellent' : 'Bon'}
                </Badge>
              </div>
              <Progress value={data.kpis.conversionRate} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Valeur vie client</p>
              <span className="text-xl font-bold">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR',
                  notation: 'compact'
                }).format(data.kpis.customerLifetimeValue)}
              </span>
              <p className="text-xs text-muted-foreground">Moyenne par étudiant</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Taux d'attrition</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{data.kpis.churnRate}%</span>
                {data.kpis.churnRate < 5 ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-warning" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.kpis.churnRate < 5 ? 'Très bon' : 'À surveiller'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}