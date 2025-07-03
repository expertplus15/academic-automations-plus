import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, Eye, Bot } from 'lucide-react';

export default function Treasury() {
  const stats = [
    {
      label: "Position Trésorerie",
      value: "€2.1M",
      change: "+5.2%",
      changeType: "positive" as const
    },
    {
      label: "Flux Entrants J+7",
      value: "€450K",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "Flux Sortants J+7",
      value: "€380K",
      change: "-3%",
      changeType: "positive" as const
    },
    {
      label: "Ratio de Liquidité",
      value: "1.8",
      change: "Optimal",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Trésorerie Temps Réel"
          subtitle="Position consolidée avec prédictions IA"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau Mouvement"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-500" />
                Position Consolidée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Vue en temps réel de tous les comptes bancaires
              </p>
              <Button className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Voir Détails
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Prévisions IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Prédictions de trésorerie à 30/60/90 jours
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Bot className="w-4 h-4" />
                Générer Prévisions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" />
                Optimisation Placement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Suggestions IA pour optimiser les placements
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Bot className="w-4 h-4" />
                Recommandations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}