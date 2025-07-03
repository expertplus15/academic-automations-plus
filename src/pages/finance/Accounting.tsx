import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calculator, FileText, BarChart3, Zap } from 'lucide-react';

export default function Accounting() {
  const { toast } = useToast();

  const handleTraitementAuto = () => {
    toast({
      title: "Traitement Automatique",
      description: "IA en cours d'analyse des factures et génération des écritures",
    });
  };

  const handleVoirJournal = () => {
    toast({
      title: "Journal Ouvert",
      description: "Interface de consultation des écritures comptables",
    });
  };

  const handleLancerControles = () => {
    toast({
      title: "Contrôles Qualité",
      description: "Vérification automatique des écritures en cours",
    });
  };
  const stats = [
    {
      label: "Écritures Automatiques",
      value: "2,847",
      change: "+23%",
      changeType: "positive" as const
    },
    {
      label: "Validation IA",
      value: "94%",
      change: "+8%",
      changeType: "positive" as const
    },
    {
      label: "Temps de Saisie",
      value: "75%",
      change: "Réduction",
      changeType: "positive" as const
    },
    {
      label: "Erreurs Détectées",
      value: "12",
      change: "-68%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Écritures Automatiques"
          subtitle="Comptabilisation intelligente avec validation IA"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle Écriture"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Saisie Automatique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                IA qui génère les écritures à partir des factures et pièces
              </p>
              <Button className="w-full gap-2" onClick={handleTraitementAuto}>
                <Zap className="w-4 h-4" />
                Traitement Auto
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-500" />
                Journal Intégré
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Consultation et validation des écritures comptables
              </p>
              <Button variant="outline" className="w-full gap-2" onClick={handleVoirJournal}>
                <Calculator className="w-4 h-4" />
                Voir Journal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Contrôles Qualité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Détection automatique d'anomalies et incohérences
              </p>
              <Button variant="outline" className="w-full gap-2" onClick={handleLancerControles}>
                <BarChart3 className="w-4 h-4" />
                Lancer Contrôles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}