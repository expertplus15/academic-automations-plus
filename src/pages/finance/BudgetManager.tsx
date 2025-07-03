import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { BudgetManager } from '@/components/finance/BudgetManager';

export default function BudgetManagerPage() {
  const stats = [
    {
      label: "Budget Total 2024-2025",
      value: "€950K",
      change: "+11.8%",
      changeType: "positive" as const
    },
    {
      label: "Consommé à ce jour",
      value: "€712K",
      change: "75%",
      changeType: "neutral" as const
    },
    {
      label: "Prédiction fin d'année",
      value: "€895K",
      change: "Confiance 90%",
      changeType: "positive" as const
    },
    {
      label: "Économies potentielles IA",
      value: "€55K",
      change: "+6.1%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Gestionnaire Budgétaire Unifié"
          subtitle="Interface consolidée avec intelligence artificielle intégrée"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau Budget"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <BudgetManager />
      </div>
    </ModuleLayout>
  );
}