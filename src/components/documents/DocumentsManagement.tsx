
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateManager } from "./TemplateManager";
import { DocumentGenerator } from "./DocumentGenerator";
import { DocumentSearch } from "./DocumentSearch";
import { ValidationDashboard } from "./ValidationDashboard";
import { Layout, FileText, Search, CheckCircle } from "lucide-react";

export function DocumentsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion Documentaire</h1>
        <p className="text-muted-foreground">
          Système complet de gestion des documents administratifs
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Layout className="w-4 h-4" />
            <span>Modèles</span>
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Génération</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Archives</span>
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Validation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <TemplateManager />
        </TabsContent>

        <TabsContent value="generator">
          <DocumentGenerator />
        </TabsContent>

        <TabsContent value="search">
          <DocumentSearch />
        </TabsContent>

        <TabsContent value="validation">
          <ValidationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
