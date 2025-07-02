
import React from 'react';
import { MainDashboardLayout } from '@/components/layouts/MainDashboardLayout';
import { ModulesGrid } from '@/components/dashboard/ModulesGrid';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function Dashboard() {
  return (
    <MainDashboardLayout>
      <DashboardHeader 
        title="Tableau de Bord Principal" 
        subtitle="Accès à tous les modules de gestion" 
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Modules de Gestion
            </h2>
            <p className="text-muted-foreground">
              Sélectionnez un module pour commencer
            </p>
          </div>
          
          <ModulesGrid />
        </div>
      </div>
    </MainDashboardLayout>
  );
}
