import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Award
} from 'lucide-react';

export default function Analytics() {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

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

  const revenueBreakdown = [
    { category: 'Frais de scolarité', amount: 580000, percentage: 68.2, color: 'bg-blue-500' },
    { category: 'Formations continues', amount: 120000, percentage: 14.1, color: 'bg-green-500' },
    { category: 'Hébergement', amount: 85000, percentage: 10.0, color: 'bg-yellow-500' },
    { category: 'Services auxiliaires', amount: 45000, percentage: 5.3, color: 'bg-purple-500' },
    { category: 'Autres revenus', amount: 20000, percentage: 2.4, color: 'bg-gray-500' }
  ];

  const departmentPerformance = [
    { name: 'Sciences', budget: 150000, spent: 142000, efficiency: 94.7 },
    { name: 'Lettres', budget: 120000, spent: 118000, efficiency: 98.3 },
    { name: 'Économie', budget: 135000, spent: 139000, efficiency: 97.0 },
    { name: 'Informatique', budget: 180000, spent: 165000, efficiency: 91.7 }
  ];

  const stats = [
    {
      label: "Performance globale",
      value: "92.5%",
      change: "+4.2%",
      changeType: "positive" as const
    },
    {
      label: "ROI formation",
      value: "15.8%",
      change: "+2.1%",
      changeType: "positive" as const
    },
    {
      label: "Efficience opérationnelle",
      value: "87.3%",
      change: "+1.5%",
      changeType: "positive" as const
    },
    {
      label: "Satisfaction financière",
      value: "4.2/5",
      change: "+0.3",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Analytics financiers"
          subtitle="Tableaux de bord et analyses de performance"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Sélecteur de métriques */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Button 
                variant={selectedMetric === 'revenue' ? 'default' : 'outline'}
                onClick={() => setSelectedMetric('revenue')}
                className={selectedMetric === 'revenue' ? 'bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90' : ''}
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

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[rgb(245,158,11)]/10 rounded-lg">
                    {index === 0 && <DollarSign className="w-5 h-5 text-[rgb(245,158,11)]" />}
                    {index === 1 && <Target className="w-5 h-5 text-[rgb(245,158,11)]" />}
                    {index === 2 && <Users className="w-5 h-5 text-[rgb(245,158,11)]" />}
                    {index === 3 && <TrendingUp className="w-5 h-5 text-[rgb(245,158,11)]" />}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition des revenus */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[rgb(245,158,11)]" />
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
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[rgb(245,158,11)]" />
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
                        <Award className="w-4 h-4 text-[rgb(245,158,11)]" />
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

        {/* Alertes et recommandations */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[rgb(245,158,11)]" />
              Recommandations stratégiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">Optimisation des revenus</h4>
                <p className="text-sm text-blue-700">
                  Augmenter les formations continues pourrait générer +€45K de revenus supplémentaires.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-900 mb-2">Contrôle des coûts</h4>
                <p className="text-sm text-yellow-700">
                  Le département Économie dépasse son budget de 3%. Révision recommandée.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">Performance</h4>
                <p className="text-sm text-green-700">
                  Le taux de recouvrement s'améliore. Objectif 95% atteignable ce trimestre.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}