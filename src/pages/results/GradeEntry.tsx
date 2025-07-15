import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Grid, FileSpreadsheet, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatrixGradeEntry } from '@/components/results/MatrixGradeEntry';
import { ManualGradeEntryPage } from '@/components/results/ManualGradeEntryPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GradeEntry() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Saisie des Notes" 
      subtitle="Interface matricielle collaborative et saisie manuelle des notes"
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
              <Grid className="h-5 w-5" />
              Interface de Saisie des Notes
            </CardTitle>
            <CardDescription>
              Choisissez votre mode de saisie : interface matricielle collaborative pour la saisie en masse
              ou saisie manuelle individuelle pour des cas spécifiques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-blue-500" />
                <span>Saisie matricielle en temps réel</span>
              </div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-green-500" />
                <span>Import/Export Excel</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-purple-500" />
                <span>Calculs automatiques</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="matrix" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Saisie Matricielle
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Saisie Manuelle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-6">
            <MatrixGradeEntry />
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <ManualGradeEntryPage />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}