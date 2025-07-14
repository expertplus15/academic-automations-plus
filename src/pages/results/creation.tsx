import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentTypesCreation from './creation/types';
import DocumentTemplatesCreation from './creation/templates';

export default function DocumentsCreation() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Configuration" 
      subtitle="Configuration des types de documents et templates"
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

        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="types" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Types de Documents
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Gestion des Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="types" className="space-y-6">
            <DocumentTypesCreation />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <DocumentTemplatesCreation />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}