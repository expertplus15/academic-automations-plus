import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TreasuryDashboard } from '@/components/finance/TreasuryDashboard';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Wallet,
  PieChart,
  Target,
  Zap
} from 'lucide-react';

export function TreasuryOverviewDashboard() {
  const kpis = [
    {
      title: "Position de Trésorerie",
      value: "€2,145,000",
      change: "+5.2%",
      changeType: "positive" as const,
      icon: Wallet,
      color: "text-blue-500"
    },
    {
      title: "Flux Journalier Net",
      value: "€45,200",
      change: "+12%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Ratio de Liquidité",
      value: "1.85",
      change: "Optimal",
      changeType: "positive" as const,
      icon: Target,
      color: "text-purple-500"
    },
    {
      title: "Efficacité Opérationnelle",
      value: "94%",
      change: "+3%",
      changeType: "positive" as const,
      icon: Zap,
      color: "text-orange-500"
    }
  ];

  const alerts = [
    {
      type: "warning",
      title: "Pic de décaissements prévu",
      message: "Salaires mensuels: €285k attendus demain",
      priority: "high"
    },
    {
      type: "info",
      title: "Rentrées importantes",
      message: "€120k de virements SEPA prévus J+2",
      priority: "medium"
    },
    {
      type: "success",
      title: "Objectif de liquidité atteint",
      message: "Ratio optimal maintenu depuis 15 jours",
      priority: "low"
    }
  ];

  const predictions = [
    {
      period: "7 prochains jours",
      inflow: 425000,
      outflow: 320000,
      net: 105000,
      confidence: 89
    },
    {
      period: "15 prochains jours", 
      inflow: 850000,
      outflow: 720000,
      net: 130000,
      confidence: 76
    },
    {
      period: "30 prochains jours",
      inflow: 1650000,
      outflow: 1420000,
      net: 230000,
      confidence: 68
    }
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      notation: amount > 999999 ? 'compact' : 'standard'
    }).format(amount);
  };

  const getAlertBadge = (type: string, priority: string) => {
    const baseClasses = "flex items-center gap-1";
    
    switch (type) {
      case 'warning':
        return <Badge className={`${baseClasses} bg-orange-100 text-orange-700 border-orange-200`}>
          <AlertTriangle className="w-3 h-3" />Attention
        </Badge>;
      case 'success':
        return <Badge className={`${baseClasses} bg-green-100 text-green-700 border-green-200`}>
          <CheckCircle className="w-3 h-3" />Succès
        </Badge>;
      default:
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-700 border-blue-200`}>
          <TrendingUp className="w-3 h-3" />Info
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-accent/50`}>
                    <IconComponent className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className={`text-sm flex items-center gap-1 ${
                      kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.changeType === 'positive' ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      {kpi.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dashboard principal intégré */}
      <TreasuryDashboard />

      {/* Prédictions IA et Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prédictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Prédictions de Flux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictions.map((pred, index) => (
              <div key={index} className="p-4 rounded-lg border border-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{pred.period}</span>
                  <span className="text-sm text-muted-foreground">
                    Confiance: {pred.confidence}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Entrées</span>
                    <span className="font-medium text-green-600">{formatAmount(pred.inflow)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Sorties</span>
                    <span className="font-medium text-red-600">{formatAmount(pred.outflow)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Solde net</span>
                      <span className={`font-bold ${pred.net > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatAmount(pred.net)}
                      </span>
                    </div>
                  </div>
                </div>

                <Progress value={pred.confidence} className="h-1 mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertes et Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Alertes & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="p-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">{alert.title}</span>
                  {getAlertBadge(alert.type, alert.priority)}
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tendances et Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Performance Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12.3%</div>
              <div className="text-sm text-muted-foreground">vs mois précédent</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Délai Moyen Encaissement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3.2j</div>
              <div className="text-sm text-muted-foreground">-0.5j ce mois</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taux de Réconciliation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98.7%</div>
              <div className="text-sm text-muted-foreground">Automatique</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}