import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Zap, Mail, Phone } from 'lucide-react';

export default function Collection() {
  const stats = [
    {
      label: "Relances Automatiques",
      value: "156",
      change: "+23%",
      changeType: "positive" as const
    },
    {
      label: "Taux de Succès",
      value: "67%",
      change: "+8%",
      changeType: "positive" as const
    },
    {
      label: "Délai Moyen",
      value: "12j",
      change: "-3j",
      changeType: "positive" as const
    },
    {
      label: "ROI Recouvrement",
      value: "340%",
      change: "+15%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Recouvrement Automatique"
          subtitle="Workflow intelligent avec IA prédictive"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau Workflow"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" />
                IA Comportementale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Analyse des patterns de paiement pour optimiser les relances
              </p>
              <Button className="w-full gap-2">
                <Bot className="w-4 h-4" />
                Analyser Comportements
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Workflows Adaptatifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Séquences de relance personnalisées par profil client
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Zap className="w-4 h-4" />
                Configurer Workflows
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-500" />
                Communication Multi-canal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Email, SMS, appels automatiques selon les préférences
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Mail className="w-4 h-4" />
                Gérer Canaux
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}