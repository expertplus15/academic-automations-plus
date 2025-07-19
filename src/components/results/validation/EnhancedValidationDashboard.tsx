
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GradeValidationSystem } from './GradeValidationSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileCheck, 
  Users,
  TrendingUp,
  Settings
} from 'lucide-react';

export function EnhancedValidationDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Centre de Validation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Système de validation en temps réel pour l'approbation des notes, bulletins et documents officiels. 
          Interface de contrôle qualité avec workflow automatisé.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Validation
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Qualité
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Rapports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="mt-6">
          <GradeValidationSystem />
        </TabsContent>

        <TabsContent value="quality" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Indicateurs de Qualité
                </CardTitle>
                <CardDescription>
                  Métriques de performance du système de validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de validation automatique</span>
                    <span className="font-semibold text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temps moyen de traitement</span>
                    <span className="font-semibold">2.3 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fiabilité des contrôles</span>
                    <span className="font-semibold text-blue-600">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Anomalies détectées</span>
                    <span className="font-semibold text-orange-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertes Système
                </CardTitle>
                <CardDescription>
                  Alertes et notifications importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Notes en attente de validation</div>
                      <div className="text-muted-foreground">12 notes nécessitent une approbation manuelle</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Système opérationnel</div>
                      <div className="text-muted-foreground">Tous les services fonctionnent normalement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapports de Validation</CardTitle>
              <CardDescription>
                Génération et consultation des rapports de validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rapports de Validation</h3>
                <p className="text-muted-foreground mb-4">
                  Les rapports détaillés seront disponibles dans la prochaine version
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du Système</CardTitle>
              <CardDescription>
                Paramètres de validation et règles de contrôle qualité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Configuration Avancée</h3>
                <p className="text-muted-foreground mb-4">
                  Les paramètres de configuration seront disponibles dans la prochaine version
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
