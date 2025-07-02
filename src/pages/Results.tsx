import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';

export default function Results() {
  return (
    <ModuleLayout 
      title="Évaluations & Résultats" 
      subtitle="Interface matricielle collaborative et bulletins ultra-rapides"
      showHeader={true}
    >
      <div className="p-6">
        <ResultsDashboard />
      </div>
    </ModuleLayout>
  );
}