import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, BarChart3, TrendingUp, Calculator } from 'lucide-react';

export default function Statements() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedStatement, setSelectedStatement] = useState('balance');

  const stats = [
    {
      label: "États générés",
      value: "15",
      change: "+3",
      changeType: "positive" as const
    },
    {
      label: "Période courante",
      value: "2024",
      change: "0",
      changeType: "neutral" as const
    },
    {
      label: "Dernière génération",
      value: "Hier",
      change: "-1j",
      changeType: "positive" as const
    },
    {
      label: "Validation comptable",
      value: "OK",
      change: "✓",
      changeType: "positive" as const
    }
  ];

  const generateStatement = (type: string) => {
    // Simulate statement generation
    console.log(`Generating ${type} statement for period ${selectedPeriod}`);
  };

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="États Financiers"
          subtitle="Génération des rapports financiers officiels"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="flex items-center gap-4 mb-6">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">Exercice 2024</SelectItem>
              <SelectItem value="2023">Exercice 2023</SelectItem>
              <SelectItem value="q4-2024">T4 2024</SelectItem>
              <SelectItem value="q3-2024">T3 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="balance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="balance">Bilan</TabsTrigger>
            <TabsTrigger value="profit">Compte de résultat</TabsTrigger>
            <TabsTrigger value="cash">Tableau de flux</TabsTrigger>
            <TabsTrigger value="annexes">Annexes</TabsTrigger>
          </TabsList>

          <TabsContent value="balance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Bilan comptable - {selectedPeriod}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">ACTIF</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Immobilisations</span>
                        <span className="font-medium">245 000 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Stocks</span>
                        <span className="font-medium">15 800 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Créances</span>
                        <span className="font-medium">89 200 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Trésorerie</span>
                        <span className="font-medium">125 300 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-blue-100 rounded font-semibold">
                        <span>Total ACTIF</span>
                        <span>475 300 €</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">PASSIF</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Capital</span>
                        <span className="font-medium">200 000 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Réserves</span>
                        <span className="font-medium">85 600 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Résultat</span>
                        <span className="font-medium">45 200 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Dettes</span>
                        <span className="font-medium">144 500 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-blue-100 rounded font-semibold">
                        <span>Total PASSIF</span>
                        <span>475 300 €</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => generateStatement('balance')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button onClick={() => generateStatement('balance')}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Compte de résultat - {selectedPeriod}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">PRODUITS</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-green-50 rounded">
                        <span>Chiffre d'affaires</span>
                        <span className="font-medium">425 800 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-50 rounded">
                        <span>Autres produits</span>
                        <span className="font-medium">15 200 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-100 rounded font-semibold">
                        <span>Total PRODUITS</span>
                        <span>441 000 €</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">CHARGES</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>Salaires et charges</span>
                        <span className="font-medium">285 600 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>Autres charges</span>
                        <span className="font-medium">110 200 €</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-100 rounded font-semibold">
                        <span>Total CHARGES</span>
                        <span>395 800 €</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between p-4 bg-blue-100 rounded font-bold text-lg">
                      <span>RÉSULTAT NET</span>
                      <span className="text-green-600">45 200 €</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => generateStatement('profit')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button onClick={() => generateStatement('profit')}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cash">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-500" />
                  Tableau des flux de trésorerie - {selectedPeriod}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Flux de trésorerie</h3>
                  <p className="text-muted-foreground mb-6">
                    Analyse des entrées et sorties de trésorerie par activité
                  </p>
                  <Button onClick={() => generateStatement('cash')}>
                    <Download className="w-4 w-4 mr-2" />
                    Générer le tableau
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="annexes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Annexes comptables - {selectedPeriod}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col" onClick={() => generateStatement('depreciation')}>
                    <Calculator className="h-6 w-6 mb-2" />
                    Tableau d'amortissement
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => generateStatement('provisions')}>
                    <FileText className="h-6 w-6 mb-2" />
                    État des provisions
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => generateStatement('commitments')}>
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Engagements hors bilan
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => generateStatement('events')}>
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Événements postérieurs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}