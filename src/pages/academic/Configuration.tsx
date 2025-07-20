
import React from 'react';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Layers, Upload, Calculator, Users } from 'lucide-react';
import { ProgramsManager } from '@/components/academic/ProgramsManager';
import { LevelsManager } from '@/components/academic/LevelsManager';
import { ExcelImportManager } from '@/components/academic/ExcelImportManager';
import { MatrixGradeEntry } from '@/components/academic/MatrixGradeEntry';
import { DUTGEImportManager } from '@/components/academic/DUTGEImportManager';

export default function AcademicConfiguration() {
  return (
    <AcademicModuleLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuration Académique</h1>
          <p className="text-muted-foreground">
            Gérez la structure académique et les outils d'import/saisie
          </p>
        </div>

        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="programs" className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Programmes</span>
            </TabsTrigger>
            <TabsTrigger value="levels" className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Niveaux</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Import Excel</span>
            </TabsTrigger>
            <TabsTrigger value="dutge" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Import DUTGE</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Saisie Notes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs">
            <ProgramsManager />
          </TabsContent>

          <TabsContent value="levels">
            <LevelsManager />
          </TabsContent>

          <TabsContent value="import">
            <ExcelImportManager />
          </TabsContent>

          <TabsContent value="dutge">
            <DUTGEImportManager />
          </TabsContent>

          <TabsContent value="grades">
            <MatrixGradeEntry />
          </TabsContent>
        </Tabs>
      </div>
    </AcademicModuleLayout>
  );
}
