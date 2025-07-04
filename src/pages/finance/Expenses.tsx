import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { ExpenseManagement } from '@/components/finance/ExpenseManagement';

export default function Expenses() {
  const stats = [
    {
      label: "Dépenses du Mois",
      value: "€38,200",
      change: "+5%",
      changeType: "neutral" as const
    },
    {
      label: "En Attente Validation",
      value: "12",
      change: "+3",
      changeType: "neutral" as const
    },
    {
      label: "Budget Consommé",
      value: "58%",
      change: "Normal",
      changeType: "positive" as const
    },
    {
      label: "Fournisseurs Actifs",
      value: "23",
      change: "+2",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Gestion des Dépenses"
          subtitle="Saisie, validation et suivi des dépenses"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle Dépense"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <ExpenseManagement />
      </div>
    </ModuleLayout>
  );
}