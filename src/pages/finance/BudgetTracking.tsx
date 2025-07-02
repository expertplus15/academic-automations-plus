import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function BudgetTracking() {
  const [searchTerm, setSearchTerm] = useState('');

  const budgetItems = [
    {
      id: '1',
      category: 'Salaires enseignants',
      department: 'Ressources Humaines',
      budgeted: 250000,
      spent: 210000,
      committed: 25000,
      remaining: 15000,
      percentage: 94.0,
      status: 'warning'
    },
    {
      id: '2',
      category: 'Équipements informatiques',
      department: 'IT',
      budgeted: 80000,
      spent: 45000,
      committed: 15000,
      remaining: 20000,
      percentage: 75.0,
      status: 'good'
    },
    {
      id: '3',
      category: 'Maintenance bâtiments',
      department: 'Infrastructure',
      budgeted: 60000,
      spent: 68000,
      committed: 5000,
      remaining: -13000,
      percentage: 121.7,
      status: 'critical'
    },
    {
      id: '4',
      category: 'Bourses étudiantes',
      department: 'Finance',
      budgeted: 150000,
      spent: 120000,
      committed: 20000,
      remaining: 10000,
      percentage: 93.3,
      status: 'warning'
    }
  ];

  const stats = [
    {
      label: "Budget total suivi",
      value: `€${budgetItems.reduce((sum, item) => sum + item.budgeted, 0).toLocaleString()}`,
      change: "+5%",
      changeType: "positive" as const
    },
    {
      label: "Dépenses actuelles",
      value: `€${budgetItems.reduce((sum, item) => sum + item.spent, 0).toLocaleString()}`,
      change: "+12%",
      changeType: "neutral" as const
    },
    {
      label: "Engagements",
      value: `€${budgetItems.reduce((sum, item) => sum + item.committed, 0).toLocaleString()}`,
      change: "+8%",
      changeType: "neutral" as const
    },
    {
      label: "Dépassements",
      value: budgetItems.filter(item => item.status === 'critical').length.toString(),
      change: "+1",
      changeType: "negative" as const
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 90) return 'bg-yellow-500';
    return 'bg-[rgb(245,158,11)]';
  };

  const filteredItems = budgetItems.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Suivi budgétaire"
          subtitle="Monitoring en temps réel des dépenses et engagements"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Alertes importantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-red-50 border-red-200 rounded-2xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Dépassement critique</p>
                  <p className="text-sm text-red-700">1 catégorie en surbudget</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 rounded-2xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">Surveillance requise</p>
                  <p className="text-sm text-yellow-700">2 catégories > 90%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 rounded-2xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Sous contrôle</p>
                  <p className="text-sm text-green-700">1 catégorie conforme</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par catégorie ou département..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Département
                </Button>
                <Button variant="outline" className="gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Statut
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suivi détaillé */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[rgb(245,158,11)]" />
              Suivi par catégorie ({filteredItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-6 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{item.category}</h3>
                        {getStatusIcon(item.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.department}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getStatusColor(item.status)}`}>
                        {item.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">d'exécution</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Progress 
                      value={Math.min(item.percentage, 100)} 
                      className="h-3"
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget alloué</p>
                        <p className="font-semibold">€{item.budgeted.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dépensé</p>
                        <p className="font-semibold">€{item.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagé</p>
                        <p className="font-semibold">€{item.committed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Disponible</p>
                        <p className={`font-semibold ${item.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          €{item.remaining.toLocaleString()}
                        </p>
                      </div>
                    </div>
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