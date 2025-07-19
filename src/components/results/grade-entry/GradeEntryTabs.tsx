import React from 'react';
import { Grid, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatrixGradeEntry } from '@/components/results/MatrixGradeEntry';
import { ManualGradeEntryPage } from '@/components/results/ManualGradeEntryPage';

export function GradeEntryTabs() {
  return (
    <Tabs defaultValue="matrix" className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/30">
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

      <TabsContent value="matrix" className="flex-1 mt-6 focus-visible:outline-none">
        <MatrixGradeEntry />
      </TabsContent>

      <TabsContent value="manual" className="flex-1 mt-6 focus-visible:outline-none">
        <ManualGradeEntryPage />
      </TabsContent>
    </Tabs>
  );
}