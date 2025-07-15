import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Factory, FileOutput, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentsEvaluationInterface } from '@/components/results/documents/DocumentsEvaluationInterface';
import { MatrixExportInterface } from '@/components/results/documents/MatrixExportInterface';

export default function Production() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Production" 
      subtitle="Centre de production et export en masse des documents"
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
              <Factory className="h-5 w-5" />
              Centre de Production
            </CardTitle>
            <CardDescription>
              Générez et exportez vos documents en masse avec efficacité. 
              Production industrielle de bulletins, relevés et exports matriciels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>Génération rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-green-500" />
                <span>Production en masse</span>
              </div>
              <div className="flex items-center gap-2">
                <FileOutput className="h-4 w-4 text-purple-500" />
                <span>Export matriciel</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="generation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <Factory className="w-4 h-4" />
              Génération Documents
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <FileOutput className="w-4 h-4" />
              Export Matriciel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generation" className="space-y-6">
            <DocumentsEvaluationInterface />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <MatrixExportInterface />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}