import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradingSystemConfig } from '@/components/results/GradingSystemConfig';
import { MatrixGradeEntry } from '@/components/results/MatrixGradeEntry';
import { GradeCalculations } from '@/components/results/GradeCalculations';
import { ResultsAnalytics } from '@/components/results/ResultsAnalytics';
import DocumentTypesCreation from './creation/types';
import DocumentTemplatesCreation from './creation/templates';

export default function GradingSystemCreation() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Système de Notation" 
      subtitle="Configuration complète du système académique et saisie des notes"
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
            Retour aux modules
          </Button>
        </div>

        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Saisie Matricielle
            </TabsTrigger>
            <TabsTrigger value="calculations" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Calculs & Moyennes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Analyse & Contrôle
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="legacy" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents (Legacy)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <GradingSystemConfig />
          </TabsContent>

          <TabsContent value="matrix" className="space-y-6">
            <MatrixGradeEntry />
          </TabsContent>

          <TabsContent value="calculations" className="space-y-6">
            <GradeCalculations />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ResultsAnalytics />
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <DocumentTemplatesCreation />
          </TabsContent>

          <TabsContent value="legacy" className="space-y-6">
            <DocumentTypesCreation />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}