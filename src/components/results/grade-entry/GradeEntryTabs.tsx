
import React from 'react';
import { Grid, FileSpreadsheet, Upload, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatrixGradeEntry } from '@/components/results/MatrixGradeEntry';
import { ManualGradeEntryPage } from '@/components/results/ManualGradeEntryPage';
import { CSVImportInterface } from '@/components/results/CSVImportInterface';
import { DeliberationPanel } from '@/components/results/DeliberationPanel';

export function GradeEntryTabs() {
  return (
    <Tabs defaultValue="matrix" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/30">
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
        <TabsTrigger 
          value="import"
          className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          <Upload className="w-4 h-4" />
          Import CSV
        </TabsTrigger>
        <TabsTrigger 
          value="deliberation"
          className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          <GraduationCap className="w-4 h-4" />
          Délibération
        </TabsTrigger>
      </TabsList>

      <TabsContent value="matrix" className="flex-1 mt-6 focus-visible:outline-none">
        <MatrixGradeEntry />
      </TabsContent>

      <TabsContent value="manual" className="flex-1 mt-6 focus-visible:outline-none">
        <ManualGradeEntryPage />
      </TabsContent>

      <TabsContent value="import" className="flex-1 mt-6 focus-visible:outline-none">
        <CSVImportInterface />
      </TabsContent>

      <TabsContent value="deliberation" className="flex-1 mt-6 focus-visible:outline-none">
        <DeliberationPanel />
      </TabsContent>
    </Tabs>
  );
}
