import React from 'react';
import { GradeEntryHeader } from './GradeEntryHeader';
import { GradeEntryTabs } from './GradeEntryTabs';

export function GradeEntryContent() {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-6 py-4 border-b border-border/50">
        <GradeEntryHeader />
      </div>
      <div className="flex-1 p-6">
        <GradeEntryTabs />
      </div>
    </div>
  );
}