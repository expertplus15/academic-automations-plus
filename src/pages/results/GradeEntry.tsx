import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { GradeEntryContent } from '@/components/results/grade-entry/GradeEntryContent';

export default function GradeEntry() {
  return (
    <ModuleLayout 
      title="Saisie des Notes" 
      subtitle="Interface matricielle collaborative et saisie manuelle des notes"
      showHeader={true}
    >
      <GradeEntryContent />
    </ModuleLayout>
  );
}