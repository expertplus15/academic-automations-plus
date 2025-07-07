import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ReceivablesManager } from '@/components/finance/ReceivablesManager';
import { 
  Award, 
  Plus, 
  RefreshCw, 
  AlertTriangle, 
  Bot, 
  Zap, 
  Mail,
  Target,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';

export default function ReceivablesCredits() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("receivables");

  const handleConfigureRules = () => {
    toast({
      title: "Configuration des Règles",
      description: "Interface de configuration des règles d'avoirs automatiques ouverte",
    });
  };

  const handleNewRegularization = () => {
    toast({
      title: "Nouvelle Régularisation",
      description: "Formulaire de régularisation comptable ouvert",
    });
  };

  const handleNewDispute = () => {
    toast({
      title: "Nouveau Litige",
      description: "Interface de gestion des litiges ouverte",
    });
  };

  const handleNewWorkflow = () => {
    toast({
      title: "Nouveau Workflow",
      description: "Assistant de création de workflow de recouvrement lancé",
    });
  };

  const stats = [
    {
      label: "Créances Totales",
      value: "€187K",
      change: "-5%",
      changeType: "positive" as const
    },
    {
      label: "Avoirs Émis",
      value: "€15.2K",
      change: "-8%",
      changeType: "positive" as const
    },
    {
      label: "Taux de Recouvrement",
      value: "89%",
      change: "+3%",
      changeType: "positive" as const
    },
    {
      label: "Délai Moyen",
      value: "12j",
      change: "-3j",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Gestion des Créances & Avoirs"
          subtitle="Dashboard unifié : recouvrement, régularisations et avoirs automatiques"
          stats={stats}
          showCreateButton={true}
          createButtonText={activeTab === "receivables" ? "Nouvelle Relance" : "Nouvel Avoir"}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="receivables">Suivi Créances</TabsTrigger>
            <TabsTrigger value="credits">Avoirs & Corrections</TabsTrigger>
            <TabsTrigger value="automation">Automatisation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="receivables" className="space-y-6">
            <ReceivablesManager />
          </TabsContent>

          <TabsContent value="credits" className="space-y-6">
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
                    Génération automatique basée sur les règles métier et patterns de paiement
                  </p>
                  <Button className="w-full gap-2" onClick={handleConfigureRules}>
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
                    Corrections comptables, ajustements de factures et réconciliations
                  </p>
                  <Button variant="outline" className="w-full gap-2" onClick={handleNewRegularization}>
                    <Plus className="w-4 h-4" />
                    Nouvelle Régularisation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Litiges & Contestations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Gestion des contestations, réclamations clients et arbitrages
                  </p>
                  <Button variant="outline" className="w-full gap-2" onClick={handleNewDispute}>
                    <Plus className="w-4 h-4" />
                    Nouveau Litige
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Tableau des derniers avoirs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Derniers Avoirs Émis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { number: "AV-24-001", student: "Martin Dubois", amount: "€250", reason: "Erreur de facturation", status: "traité" },
                    { number: "AV-24-002", student: "Sophie Laurent", amount: "€180", reason: "Remboursement partiel", status: "en cours" },
                    { number: "AV-24-003", student: "Jean Moreau", amount: "€320", reason: "Annulation inscription", status: "validé" }
                  ].map((credit, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{credit.number}</div>
                        <div className="text-sm text-muted-foreground">{credit.student}</div>
                      </div>
                      <div className="text-center px-4">
                        <div className="font-bold">{credit.amount}</div>
                        <div className="text-xs text-muted-foreground">{credit.reason}</div>
                      </div>
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          credit.status === 'traité' ? 'bg-green-100 text-green-700' :
                          credit.status === 'validé' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {credit.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
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
                    Analyse des patterns de paiement pour optimiser les relances et prédire les risques
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
                    Séquences de relance personnalisées par profil client et historique de paiement
                  </p>
                  <Button variant="outline" className="w-full gap-2" onClick={handleNewWorkflow}>
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
                    Email, SMS, appels automatiques selon les préférences et efficacité par canal
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    <Mail className="w-4 h-4" />
                    Gérer Canaux
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Métriques d'automatisation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-500" />
                    Actions Automatiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Relances envoyées:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avoirs générés:</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plans proposés:</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Performance IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Taux de succès:</span>
                      <span className="font-medium text-green-600">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prédictions justes:</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI recouvrement:</span>
                      <span className="font-medium text-green-600">340%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    Impact Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Satisfaction:</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Délai moyen:</span>
                      <span className="font-medium">12j</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Litiges réduits:</span>
                      <span className="font-medium text-green-600">-45%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Évolution Globale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Créances en cours</span>
                      <span className="font-bold">€187,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600">Recouvrements</span>
                      <span className="font-bold text-green-600">€45,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600">Avoirs émis</span>
                      <span className="font-bold text-blue-600">€15,200</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span>Efficacité globale</span>
                        <span className="font-bold text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Objectifs & KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Recouvrement mensuel</span>
                        <span>€45,200 / €50,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Réduction créances</span>
                        <span>85% / 80%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '106%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Satisfaction client</span>
                        <span>96% / 95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '101%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}