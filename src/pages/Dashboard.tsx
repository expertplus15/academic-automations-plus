
import React from 'react';
import { MainDashboardLayout } from '@/components/layouts/MainDashboardLayout';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { ModulesGrid } from '@/components/dashboard/ModulesGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default function Dashboard() {
  return (
    <MainDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#4F78FF] to-[#8B5CF6] p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header avec salutation et cartes de statut */}
          <WelcomeHeader />
          
          {/* Modules de gestion */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Modules de Gestion</h2>
            <ModulesGrid />
          </div>
          
          {/* Actions rapides */}
          <QuickActions />
          
          {/* Activité récente */}
          <RecentActivity />
        </div>
      </div>
    </MainDashboardLayout>
  );
}
