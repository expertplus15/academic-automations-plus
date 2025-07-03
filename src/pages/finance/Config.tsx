import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Database, FileText, Users } from 'lucide-react';

export default function Config() {
  const stats = [
    {
      label: "Comptes Configurés",
      value: "127",
      change: "+5",
      changeType: "positive" as const
    },
    {
      label: "Règles Actives",
      value: "23",
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Intégrations",
      value: "8",
      change: "Stable",
      changeType: "neutral" as const
    },
    {
      label: "Dernière MAJ",
      value: "2h",
      change: "Récent",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Configuration Système"
          subtitle="Plan comptable & paramètres globaux"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau Paramètre"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                Plan Comptable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configuration des comptes et structure comptable
              </p>
              <Button className="w-full gap-2">
                <Database className="w-4 h-4" />
                Gérer le Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Modèles Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Templates factures, devis et documents officiels
              </p>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="w-4 h-4" />
                Configurer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                Paramètres Généraux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Devise, formats de date, numérotation automatique
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Settings className="w-4 h-4" />
                Modifier
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}