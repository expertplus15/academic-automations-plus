
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExamIntegrationEvents } from './ExamIntegrationEvents';
import { ExamIntegrationConfig } from './ExamIntegrationConfig';
import { ExamIntegrationDetails } from './ExamIntegrationDetails';

interface SyncEvent {
  id: string;
  module: string;
  action: string;
  status: string;
  timestamp: Date;
}

interface SyncConfig {
  autoSync: boolean;
  enabledModules: string[];
  batchSize: number;
}

interface ExamIntegrationTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  syncEvents: SyncEvent[];
  syncConfig: SyncConfig;
  selectedExam: string;
  hasAcademicIntegration: boolean;
  hasStudentIntegration: boolean;
  hasResourceIntegration: boolean;
}

export function ExamIntegrationTabs({
  activeTab,
  onTabChange,
  syncEvents,
  syncConfig,
  selectedExam,
  hasAcademicIntegration,
  hasStudentIntegration,
  hasResourceIntegration
}: ExamIntegrationTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="academic">Académique</TabsTrigger>
        <TabsTrigger value="students">Étudiants</TabsTrigger>
        <TabsTrigger value="resources">Ressources</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExamIntegrationEvents events={syncEvents} />
          <ExamIntegrationConfig config={syncConfig} />
        </div>
      </TabsContent>

      <TabsContent value="academic" className="space-y-4">
        <ExamIntegrationDetails
          module="academic"
          selectedExam={selectedExam}
          hasIntegration={hasAcademicIntegration}
        />
      </TabsContent>

      <TabsContent value="students" className="space-y-4">
        <ExamIntegrationDetails
          module="students"
          selectedExam={selectedExam}
          hasIntegration={hasStudentIntegration}
        />
      </TabsContent>

      <TabsContent value="resources" className="space-y-4">
        <ExamIntegrationDetails
          module="resources"
          selectedExam={selectedExam}
          hasIntegration={hasResourceIntegration}
        />
      </TabsContent>
    </Tabs>
  );
}
