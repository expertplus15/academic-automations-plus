
import React from 'react';
import { Grid, FileSpreadsheet, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatrixGradeEntryPage } from './MatrixGradeEntryPage';
import { ManualGradeEntryPage } from '@/components/results/ManualGradeEntryPage';
import { GradeImportTab } from './GradeImportTab';

export function GradeEntryTabs() {
  return (
    <Tabs defaultValue="import" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/30">
        <TabsTrigger 
          value="import" 
          className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          <Upload className="w-4 h-4" />
          Import
        </TabsTrigger>
        <TabsTrigger 
          value="matrix" 
          className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          <Grid className="w-4 h-4" />
          Saisie Matricielle
        </TabsTrigger>
        <TabsTrigger 
          value="manual"
          className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Saisie Manuelle
        </TabsTrigger>
      </TabsList>

      <TabsContent value="import" className="flex-1 mt-6 focus-visible:outline-none">
        <GradeImportTab />
      </TabsContent>

      <TabsContent value="matrix" className="flex-1 mt-6 focus-visible:outline-none">
        <MatrixGradeEntryPage />
      </TabsContent>

      <TabsContent value="manual" className="flex-1 mt-6 focus-visible:outline-none">
        <ManualGradeEntryPage />
      </TabsContent>
    </Tabs>
  );
}
