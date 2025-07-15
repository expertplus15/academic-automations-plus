import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Settings, Layout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentsEvaluationInterface } from '@/components/results/documents/DocumentsEvaluationInterface';
import { MatrixExportInterface } from '@/components/results/documents/MatrixExportInterface';
import DocumentTypesCreation from './creation/types';
import DocumentTemplatesCreation from './creation/templates';

export default function Documents() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Documents" 
      subtitle="Bulletins, relevés, attestations et templates personnalisables"
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
              <FileText className="h-5 w-5" />
              Gestion Documentaire
            </CardTitle>
            <CardDescription>
              Créez et gérez tous vos documents d'évaluation : bulletins de notes, relevés de notes,
              attestations et certificats avec des templates personnalisables.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Génération automatique</span>
              </div>
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-green-500" />
                <span>Templates personnalisables</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" />
                <span>Configuration avancée</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="generation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Génération
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Export Matriciel
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="types" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Types de Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generation" className="space-y-6">
            <DocumentsEvaluationInterface />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <MatrixExportInterface />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <DocumentTemplatesCreation />
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <DocumentTypesCreation />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}