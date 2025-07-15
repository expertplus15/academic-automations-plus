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
      <div className="p-6 animate-fade-in">
        <GradeEntryHeader />
        <GradeEntryTabs />
      </div>
    </ModuleLayout>
  );
}