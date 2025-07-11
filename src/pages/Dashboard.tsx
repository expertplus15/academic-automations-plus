
import React from 'react';
import { MainDashboardLayout } from '@/components/layouts/MainDashboardLayout';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { ModulesGrid } from '@/components/dashboard/ModulesGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { EnhancedTestsPanel } from '@/components/debug/EnhancedTestsPanel';

export default function Dashboard() {
  return (
    <MainDashboardLayout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header avec salutation et cartes de statut */}
          <WelcomeHeader />
          
          {/* Modules de gestion */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Modules de Gestion</h2>
            <ModulesGrid />
          </div>
          
          {/* Actions rapides */}
          <QuickActions />
          
          {/* Activité récente */}
          <RecentActivity />
        </div>
      </div>
      
      {/* Panneau de tests (développement/debug) */}
      <EnhancedTestsPanel />
    </MainDashboardLayout>
  );
}
