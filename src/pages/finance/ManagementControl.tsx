import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, BarChart3, AlertTriangle } from 'lucide-react';

export default function ManagementControl() {
  const stats = [
    {
      label: "KPIs Suivis",
      value: "42",
      change: "+5",
      changeType: "positive" as const
    },
    {
      label: "Écarts Détectés",
      value: "7",
      change: "-3",
      changeType: "positive" as const
    },
    {
      label: "Objectifs Atteints",
      value: "89%",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "ROI Moyen",
      value: "12.4%",
      change: "+1.8%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Contrôle de Gestion"
          subtitle="KPIs, écarts et pilotage de la performance"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau KPI"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Tableaux de Bord
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                KPIs temps réel avec alertes automatiques
              </p>
              <Button className="w-full gap-2">
                <BarChart3 className="w-4 h-4" />
                Voir Dashboards
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Analyse d'Écarts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Détection automatique et analyse des dérives
              </p>
              <Button variant="outline" className="w-full gap-2">
                <AlertTriangle className="w-4 h-4" />
                Analyser Écarts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Plans d'Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Recommandations IA et suivi des actions correctives
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Target className="w-4 h-4" />
                Créer Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}