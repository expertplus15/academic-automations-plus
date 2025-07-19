
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MatrixGradeEntry } from '../MatrixGradeEntry';
import { ManualGradeEntryPage } from '../ManualGradeEntryPage';
import { ExamGradeSync } from '../ExamGradeSync';
import { 
  Grid3X3, 
  UserPlus, 
  ArrowRightLeft,
  Calculator
} from 'lucide-react';

export function GradeEntryTabs() {
  const [activeTab, setActiveTab] = useState('sync');

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Sync Examens
          </TabsTrigger>
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Saisie Matricielle
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Saisie Manuelle
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculatrice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sync" className="flex-1 mt-6">
          <ExamGradeSync />
        </TabsContent>

        <TabsContent value="matrix" className="flex-1 mt-6">
          <MatrixGradeEntry />
        </TabsContent>

        <TabsContent value="manual" className="flex-1 mt-6">
          <ManualGradeEntryPage />
        </TabsContent>

        <TabsContent value="calculator" className="flex-1 mt-6">
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Calculatrice de moyennes - À implémenter</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
