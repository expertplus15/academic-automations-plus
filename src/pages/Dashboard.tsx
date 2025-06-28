
import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ComprehensiveDashboard } from '@/components/dashboard/ComprehensiveDashboard';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function Dashboard() {
  return (
    <ModuleLayout>
      <div className="min-h-screen bg-background">
        <DashboardHeader 
          title="Tableau de Bord Intelligent" 
          subtitle="Surveillance temps réel avec IA intégrée" 
        />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <ComprehensiveDashboard />
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
