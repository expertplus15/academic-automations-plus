import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function CashFlow() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const cashFlowData = [
    {
      period: 'Janvier 2024',
      income: 185000,
      expenses: 165000,
      netFlow: 20000,
      cumulativeBalance: 320000
    },
    {
      period: 'Février 2024',
      income: 195000,
      expenses: 175000,
      netFlow: 20000,
      cumulativeBalance: 340000
    },
    {
      period: 'Mars 2024',
      income: 180000,
      expenses: 190000,
      netFlow: -10000,
      cumulativeBalance: 330000
    },
    {
      period: 'Avril 2024',
      income: 220000,
      expenses: 185000,
      netFlow: 35000,
      cumulativeBalance: 365000
    }
  ];

  const projections = [
    {
      month: 'Mai 2024',
      projectedIncome: 210000,
      projectedExpenses: 180000,
      projectedNetFlow: 30000
    },
    {
      month: 'Juin 2024',
      projectedIncome: 235000,
      projectedExpenses: 195000,
      projectedNetFlow: 40000
    },
    {
      month: 'Juillet 2024',
      projectedIncome: 125000,
      projectedExpenses: 160000,
      projectedNetFlow: -35000
    }
  ];

  const stats = [
    {
      label: "Flux net actuel",
      value: `€${cashFlowData[cashFlowData.length - 1]?.netFlow.toLocaleString()}`,
      change: "+75%",
      changeType: "positive" as const
    },
    {
      label: "Balance cumulative",
      value: `€${cashFlowData[cashFlowData.length - 1]?.cumulativeBalance.toLocaleString()}`,
      change: "+7.4%",
      changeType: "positive" as const
    },
    {
      label: "Revenus moyens",
      value: `€${Math.round(cashFlowData.reduce((sum, d) => sum + d.income, 0) / cashFlowData.length).toLocaleString()}`,
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "Projection 3 mois",
      value: `€${projections.reduce((sum, p) => sum + p.projectedNetFlow, 0).toLocaleString()}`,
      change: "+8%",
      changeType: "positive" as const
    }
  ];

  const getFlowIcon = (amount: number) => {
    if (amount > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (amount < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getFlowColor = (amount: number) => {
    if (amount > 0) return "text-green-600";
    if (amount < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Flux de trésorerie"
          subtitle="Analyse des mouvements financiers et projections"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Sélecteur de période */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Button 
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('week')}
              >
                Semaine
              </Button>
              <Button 
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('month')}
                className={selectedPeriod === 'month' ? 'bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90' : ''}
              >
                Mois
              </Button>
              <Button 
                variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('quarter')}
              >
                Trimestre
              </Button>
              <Button 
                variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('year')}
              >
                Année
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Graphique de flux et tableau */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tableau des flux */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[rgb(245,158,11)]" />
                Flux mensuels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cashFlowData.map((data, index) => (
                  <div key={index} className="p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{data.period}</span>
                      <div className="flex items-center gap-1">
                        {getFlowIcon(data.netFlow)}
                        <span className={`font-bold ${getFlowColor(data.netFlow)}`}>
                          €{data.netFlow.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Revenus</p>
                        <p className="font-semibold text-green-600">€{data.income.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dépenses</p>
                        <p className="font-semibold text-red-600">€{data.expenses.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Balance</p>
                        <p className="font-semibold">€{data.cumulativeBalance.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projections */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[rgb(245,158,11)]" />
                Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projections.map((projection, index) => (
                  <div key={index} className="p-4 rounded-xl bg-muted/30 border border-dashed border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{projection.month}</span>
                      <Badge variant="outline" className="text-xs">
                        Prévision
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Revenus prév.</p>
                        <p className="font-semibold text-green-600">€{projection.projectedIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dépenses prév.</p>
                        <p className="font-semibold text-red-600">€{projection.projectedExpenses.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Flux net prév.</p>
                        <p className={`font-semibold ${getFlowColor(projection.projectedNetFlow)}`}>
                          €{projection.projectedNetFlow.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicateurs de santé financière */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-base">Liquidité actuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">€365,000</p>
                  <p className="text-sm text-muted-foreground">Trésorerie disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-base">Ratio de liquidité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.1</p>
                  <p className="text-sm text-muted-foreground">Excellent niveau</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-base">Jours de couverture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[rgb(245,158,11)]/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-[rgb(245,158,11)]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">65</p>
                  <p className="text-sm text-muted-foreground">Jours d'autonomie</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}