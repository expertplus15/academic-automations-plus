import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Brain, Shield, Target } from 'lucide-react';

export default function RiskScoring() {
  const stats = [
    {
      label: "Précision Prédictions",
      value: "91%",
      change: "+3%",
      changeType: "positive" as const
    },
    {
      label: "Clients à Risque",
      value: "23",
      change: "-5",
      changeType: "positive" as const
    },
    {
      label: "Prévention Impayés",
      value: "€89K",
      change: "+25%",
      changeType: "positive" as const
    },
    {
      label: "Score Moyen",
      value: "7.2/10",
      change: "+0.3",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Scoring Risques IA"
          subtitle="Prédiction intelligente des défaillances de paiement"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau Modèle"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Modèles Prédictifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Algorithmes ML pour prédire les risques d'impayés
              </p>
              <Button className="w-full gap-2">
                <Brain className="w-4 h-4" />
                Entraîner Modèle
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Indicateurs Avancés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Variables comportementales et financières en temps réel
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Shield className="w-4 h-4" />
                Configurer Indicateurs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Actions Préventives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Recommandations automatiques basées sur les scores
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