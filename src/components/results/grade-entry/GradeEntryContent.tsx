import React from 'react';
import { GradeEntryTabs } from './GradeEntryTabs';
import { ResultsQuickActions } from '@/components/results/ResultsQuickActions';

export function GradeEntryContent() {
  const handleImport = () => {
    console.log('Import action');
  };

  const handleExport = () => {
    console.log('Export action'); 
  };

  const handleRefresh = () => {
    console.log('Refresh action');
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <ResultsQuickActions
        onImport={handleImport}
        onExport={handleExport}
        onRefresh={handleRefresh}
        pendingActions={0}
      />
      
      <div className="flex-1">
        <GradeEntryTabs />
      </div>
    </div>
  );
}