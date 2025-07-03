import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, AlertTriangle, Clock, Target } from 'lucide-react';

export default function Receivables() {
  const stats = [
    {
      label: "Créances Totales",
      value: "€187K",
      change: "-5%",
      changeType: "positive" as const
    },
    {
      label: "Échues > 30j",
      value: "€42K",
      change: "-12%",
      changeType: "positive" as const
    },
    {
      label: "Risque Élevé",
      value: "€8.5K",
      change: "-20%",
      changeType: "positive" as const
    },
    {
      label: "Taux de Recouvrement",
      value: "89%",
      change: "+3%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Dashboard Créances"
          subtitle="Vue temps réel avec scoring risque IA"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle Relance"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-500" />
                Analyse par Échéance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Répartition des créances par tranche d'échéance
              </p>
              <Button className="w-full gap-2">
                <PieChart className="w-4 h-4" />
                Voir Analyse
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Alertes Risques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Détection automatique des situations à risque
              </p>
              <Button variant="outline" className="w-full gap-2">
                <AlertTriangle className="w-4 h-4" />
                Voir Alertes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Actions Prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Recommandations IA pour optimiser le recouvrement
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Target className="w-4 h-4" />
                Voir Actions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}