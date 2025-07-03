import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Zap, Calendar } from 'lucide-react';

export default function Closing() {
  const stats = [
    {
      label: "Clôture Mars",
      value: "J+2",
      change: "Record",
      changeType: "positive" as const
    },
    {
      label: "Automatisation",
      value: "87%",
      change: "+15%",
      changeType: "positive" as const
    },
    {
      label: "Contrôles Passés",
      value: "24/24",
      change: "100%",
      changeType: "positive" as const
    },
    {
      label: "Gain de Temps",
      value: "6.5j",
      change: "vs manuel",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Clôtures Express"
          subtitle="Automatisation complète - Objectif J+3 mensuel"
          stats={stats}
          showCreateButton={true}
          createButtonText="Lancer Clôture"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Processus Automatisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Workflow complet de clôture avec contrôles intégrés
              </p>
              <Button className="w-full gap-2">
                <Zap className="w-4 h-4" />
                Démarrer Clôture
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Contrôles Qualité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Validation automatique des cohérences comptables
              </p>
              <Button variant="outline" className="w-full gap-2">
                <CheckCircle className="w-4 h-4" />
                Voir Contrôles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Planning Intégré
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Calendrier automatique avec notifications équipes
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Calendar className="w-4 h-4" />
                Voir Planning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}