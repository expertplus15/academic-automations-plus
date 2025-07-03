import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Plus, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Credits() {
  const stats = [
    {
      label: "Avoirs Émis",
      value: "€15.2K",
      change: "-8%",
      changeType: "positive" as const
    },
    {
      label: "Avoirs en Attente",
      value: "12",
      change: "-3",
      changeType: "positive" as const
    },
    {
      label: "Régularisations",
      value: "8",
      change: "+2",
      changeType: "neutral" as const
    },
    {
      label: "Taux de Satisfaction",
      value: "96%",
      change: "+2%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Gestion des Avoirs"
          subtitle="Régularisations, remboursements et avoirs automatiques"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvel Avoir"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" />
                Avoirs Automatiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Génération automatique basée sur les règles métier
              </p>
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Configurer Règles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                Régularisations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Corrections comptables et ajustements de factures
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle Régularisation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Litiges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gestion des contestations et réclamations clients
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Litige
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}