
import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { UnifiedDashboard } from '@/components/unified/UnifiedDashboard';

export default function Results() {
  return (
    <ModuleLayout 
      title="Tableau de Bord Unifiée" 
      subtitle="Vue d'ensemble des examens, notes et workflows automatisés"
      showHeader={true}
    >
      <div className="p-6 animate-fade-in">
        <UnifiedDashboard />
      </div>
    </ModuleLayout>
  );
}
