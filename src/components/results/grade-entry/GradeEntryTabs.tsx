import React from 'react';
import { Grid, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatrixGradeEntry } from '@/components/results/MatrixGradeEntry';
import { ManualGradeEntryPage } from '@/components/results/ManualGradeEntryPage';

export function GradeEntryTabs() {
  return (
    <Tabs defaultValue="matrix" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="matrix">
          Saisie Matricielle
        </TabsTrigger>
        <TabsTrigger value="manual">
          Saisie Manuelle
        </TabsTrigger>
      </TabsList>

      <TabsContent value="matrix" className="mt-4">
        <MatrixGradeEntry />
      </TabsContent>

      <TabsContent value="manual" className="mt-4">
        <ManualGradeEntryPage />
      </TabsContent>
    </Tabs>
  );
}