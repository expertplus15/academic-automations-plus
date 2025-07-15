import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { GradeEntryHeader } from '@/components/results/grade-entry/GradeEntryHeader';
import { GradeEntryTabs } from '@/components/results/grade-entry/GradeEntryTabs';

export default function GradeEntry() {
  return (
    <ModuleLayout 
      title="Saisie des Notes" 
      subtitle="Interface matricielle collaborative et saisie manuelle des notes"
      showHeader={true}
    >
      <div className="flex flex-col h-full animate-fade-in">
        <div className="px-6 py-4 border-b border-border/50">
          <GradeEntryHeader />
        </div>
        <div className="flex-1 p-6">
          <GradeEntryTabs />
        </div>
      </div>
    </ModuleLayout>
  );
}