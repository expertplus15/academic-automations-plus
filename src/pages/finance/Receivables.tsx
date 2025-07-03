import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { ReceivablesManager } from '@/components/finance/ReceivablesManager';

export default function Receivables() {
  const stats = [
    {
      label: "Créances Totales",
      value: "€187K",
      change: "-5%",
      changeType: "positive" as const
    },
    {
      label: "Échues > 30j",
      value: "€42K",
      change: "-12%",
      changeType: "positive" as const
    },
    {
      label: "Risque Élevé",
      value: "€8.5K",
      change: "-20%",
      changeType: "positive" as const
    },
    {
      label: "Taux de Recouvrement",
      value: "89%",
      change: "+3%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Dashboard Créances"
          subtitle="Vue temps réel avec scoring risque IA"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle Relance"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <ReceivablesManager />
      </div>
    </ModuleLayout>
  );
}