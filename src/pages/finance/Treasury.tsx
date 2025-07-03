import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { TreasuryDashboard } from '@/components/finance/TreasuryDashboard';

export default function Treasury() {
  const stats = [
    {
      label: "Position Trésorerie",
      value: "€2.1M",
      change: "+5.2%",
      changeType: "positive" as const
    },
    {
      label: "Flux Entrants J+7",
      value: "€450K",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "Flux Sortants J+7",
      value: "€380K",
      change: "-3%",
      changeType: "positive" as const
    },
    {
      label: "Ratio de Liquidité",
      value: "1.8",
      change: "Optimal",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Trésorerie Temps Réel"
          subtitle="Position consolidée avec prédictions IA"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau Mouvement"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <TreasuryDashboard />
      </div>
    </ModuleLayout>
  );
}