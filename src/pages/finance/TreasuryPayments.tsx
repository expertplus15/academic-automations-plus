import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { TreasuryPaymentsHub } from '@/components/finance/TreasuryPaymentsHub';

export default function TreasuryPayments() {
  const stats = [
    {
      label: "Position Globale",
      value: "€2.1M",
      change: "+5.2%",
      changeType: "positive" as const
    },
    {
      label: "Paiements du Jour",
      value: "€125K",
      change: "+8%",
      changeType: "positive" as const
    },
    {
      label: "Flux Entrants J+7",
      value: "€450K",
      change: "+12%",
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
          title="Trésorerie & Hub Paiements"
          subtitle="Position consolidée, paiements et prédictions IA"
          stats={stats}
          showCreateButton={false}
          showExportButton={false}
          showBackButton={true}
          backPath="/finance"
        />

        <TreasuryPaymentsHub />
      </div>
    </ModuleLayout>
  );
}