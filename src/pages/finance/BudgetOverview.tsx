import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle
} from 'lucide-react';

export default function BudgetOverview() {
  const budgetData = [
    {
      category: 'Salaires et charges',
      budgeted: 450000,
      actual: 385000,
      variance: -65000,
      percentage: 85.6
    },
    {
      category: 'Équipements pédagogiques',
      budgeted: 120000,
      actual: 98000,
      variance: -22000,
      percentage: 81.7
    },
    {
      category: 'Maintenance et réparations',
      budgeted: 80000,
      actual: 95000,
      variance: 15000,
      percentage: 118.8
    },
    {
      category: 'Bourses étudiantes',
      budgeted: 200000,
      actual: 175000,
      variance: -25000,
      percentage: 87.5
    }
  ];

  const stats = [
    {
      label: "Budget total",
      value: "€850,000",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "Dépenses réelles",
      value: "€753,000",
      change: "+8%",
      changeType: "neutral" as const
    },
    {
      label: "Variance totale",
      value: "€-97,000",
      change: "-11.4%",
      changeType: "positive" as const
    },
    {
      label: "Taux d'exécution",
      value: "88.6%",
      change: "+2.1%",
      changeType: "positive" as const
    }
  ];

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-red-600";
    if (variance < 0) return "text-green-600";
    return "text-muted-foreground";
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-4 h-4 text-red-600" />;
    if (variance < 0) return <TrendingDown className="w-4 h-4 text-green-600" />;
    return null;
  };

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Vue d'ensemble budgétaire"
          subtitle="Analyse des budgets et performances financières"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Graphiques de synthèse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition budgétaire */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[rgb(245,158,11)]" />
                Répartition par catégorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(item.percentage, 100)} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>€{item.actual.toLocaleString()} / €{item.budgeted.toLocaleString()}</span>
                      <span className={getVarianceColor(item.variance)}>
                        {item.variance > 0 ? '+' : ''}€{item.variance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Indicateurs clés */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[rgb(245,158,11)]" />
                Indicateurs de performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Économies réalisées</p>
                      <p className="text-sm text-muted-foreground">Par rapport au budget prévu</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">€97,000</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Projection fin d'année</p>
                      <p className="text-sm text-muted-foreground">Basée sur la tendance actuelle</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">€820,000</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Dépassements</p>
                      <p className="text-sm text-muted-foreground">Catégories en surbudget</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détail par catégorie */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[rgb(245,158,11)]" />
              Analyse détaillée par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <DollarSign className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.category}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Budget: €{item.budgeted.toLocaleString()}</span>
                        <span>Réel: €{item.actual.toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                          {getVarianceIcon(item.variance)}
                          <span className={getVarianceColor(item.variance)}>
                            {item.variance > 0 ? '+' : ''}€{item.variance.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{item.percentage.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">d'exécution</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}