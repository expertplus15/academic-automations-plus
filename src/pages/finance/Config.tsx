import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FeeTypesManager } from '@/components/finance/FeeTypesManager';
import { ServiceTypesManager } from '@/components/finance/ServiceTypesManager';
import { AcademicYearSelector } from '@/components/finance/AcademicYearSelector';
import { Settings, Database, FileText, Users, Euro, Receipt, Calendar } from 'lucide-react';

export default function Config() {
  const { toast } = useToast();
  const [showFeeTypesManager, setShowFeeTypesManager] = useState(false);
  const [showServiceTypesManager, setShowServiceTypesManager] = useState(false);

  const handleGererPlan = () => {
    toast({
      title: "Plan Comptable",
      description: "Interface de gestion du plan comptable ouverte",
    });
  };

  const handleConfigurerTemplates = () => {
    toast({
      title: "Templates Documents",
      description: "Configuration des modèles de documents lancée",
    });
  };

  const handleModifierParametres = () => {
    toast({
      title: "Paramètres Généraux",
      description: "Interface de modification des paramètres système ouverte",
    });
  };
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
              <Button className="w-full gap-2" onClick={handleGererPlan}>
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
              <Button variant="outline" className="w-full gap-2" onClick={handleConfigurerTemplates}>
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
              <Button variant="outline" className="w-full gap-2" onClick={handleModifierParametres}>
                <Settings className="w-4 h-4" />
                Modifier
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-orange-500" />
                Gestion des Frais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Types de frais, prestations et tarification
              </p>
              <div className="space-y-2">
                <Dialog open={showFeeTypesManager} onOpenChange={setShowFeeTypesManager}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Euro className="w-4 h-4" />
                      Types de Frais
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Gestion des Types de Frais</DialogTitle>
                    </DialogHeader>
                    <FeeTypesManager />
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showServiceTypesManager} onOpenChange={setShowServiceTypesManager}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Receipt className="w-4 h-4" />
                      Prestations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Gestion des Prestations de Services</DialogTitle>
                    </DialogHeader>
                    <ServiceTypesManager />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Année Académique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Sélection de l'année académique active
              </p>
              <div className="space-y-2">
                <AcademicYearSelector />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}