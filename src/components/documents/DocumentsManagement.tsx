
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentGenerator } from "./DocumentGenerator";
import { DocumentSearch } from "./DocumentSearch";
import { FileText, Search } from "lucide-react";

export function DocumentsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion Documentaire</h1>
        <p className="text-muted-foreground">
          Système complet de gestion des documents administratifs
        </p>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Génération</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Archives</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <DocumentGenerator />
        </TabsContent>

        <TabsContent value="search">
          <DocumentSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
}
