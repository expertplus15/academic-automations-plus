
import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculationCard } from '@/components/calculations/CalculationCard';

export default function Calculations() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Calculs & Moyennes" 
      subtitle="Moyennes, ECTS, compensations et mentions automatiques"
      showHeader={true}
    >
      <div className="p-6 animate-fade-in">
        {/* Header avec navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/results")}
            className="w-fit hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>

        {/* Description du module */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Module de Calculs
            </CardTitle>
            <CardDescription>
              Automatisez les calculs de moyennes, ECTS, compensations et mentions académiques.
              Système de calcul intelligent avec règles personnalisables.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-500" />
                <span>Calculs automatisés</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Moyennes pondérées</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                <span>Mentions & ECTS</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="calculations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculations" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculs
            </TabsTrigger>
            <TabsTrigger value="averages" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Moyennes
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Mentions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CalculationCard
                title="Calcul des Moyennes"
                description="Calcule les moyennes générales et par matière avec pondération automatique"
                icon={<Calculator className="w-5 h-5 text-blue-500" />}
                status="idle"
                resultCount={1247}
                lastRun="Il y a 2 heures"
                onExecute={() => console.log('Calcul des moyennes')}
              />
              
              <CalculationCard
                title="Calcul ECTS"
                description="Attribution des crédits ECTS selon les règles de compensation"
                icon={<Award className="w-5 h-5 text-green-500" />}
                status="completed"
                resultCount={892}
                lastRun="Il y a 1 heure"
                onExecute={() => console.log('Calcul ECTS')}
              />
              
              <CalculationCard
                title="Mentions & Distinctions"
                description="Calcul automatique des mentions selon les critères académiques"
                icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
                status="idle"
                resultCount={156}
                lastRun="Il y a 3 heures"
                onExecute={() => console.log('Calcul mentions')}
              />
            </div>
          </TabsContent>

          <TabsContent value="averages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des Moyennes</CardTitle>
                <CardDescription>
                  Paramètres de calcul des moyennes générales et par matière
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interface de configuration des règles de calcul des moyennes...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Système de Mentions</CardTitle>
                <CardDescription>
                  Configuration des seuils et critères pour les mentions académiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interface de gestion des mentions et distinctions...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}
