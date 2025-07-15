import React from 'react';
import { Grid, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatrixGradeEntry } from '@/components/results/MatrixGradeEntry';
import { ManualGradeEntryPage } from '@/components/results/ManualGradeEntryPage';

export function GradeEntryTabs() {
  return (
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
  );
}