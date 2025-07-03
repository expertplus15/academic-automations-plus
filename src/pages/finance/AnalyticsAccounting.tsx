import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart, TrendingUp, Filter } from 'lucide-react';

export default function AnalyticsAccounting() {
  const stats = [
    {
      label: "Axes Analytiques",
      value: "8",
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Centres de Coût",
      value: "24",
      change: "+3",
      changeType: "positive" as const
    },
    {
      label: "Précision Affectation",
      value: "96%",
      change: "+4%",
      changeType: "positive" as const
    },
    {
      label: "Temps d'Analyse",
      value: "85%",
      change: "Réduction",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Comptabilité Analytique"
          subtitle="Analyse multi-axes avec ventilation automatique"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvel Axe"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Axes Multiples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Centres de coût, projets, départements, activités
              </p>
              <Button className="w-full gap-2">
                <BarChart3 className="w-4 h-4" />
                Configurer Axes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-500" />
                Ventilation Auto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Répartition automatique basée sur des règles métier
              </p>
              <Button variant="outline" className="w-full gap-2">
                <PieChart className="w-4 h-4" />
                Gérer Règles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Analyses Croisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Reporting multi-dimensionnel avec drill-down
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Filter className="w-4 h-4" />
                Créer Analyse
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}