import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { CommercialBilling } from '@/components/finance/CommercialBilling';

export default function Commercial() {
  const stats = [
    {
      label: "Factures Commerciales",
      value: "47",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "CA Prévisionnel",
      value: "€280K",
      change: "+8.5%",
      changeType: "positive" as const
    },
    {
      label: "Clients Actifs",
      value: "23",
      change: "+3",
      changeType: "positive" as const
    },
    {
      label: "Taux de Conversion",
      value: "78%",
      change: "+5%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Facturation Commerciale"
          subtitle="Gestion des prestations B2B et facturation externe"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle Facture"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <CommercialBilling />
      </div>
    </ModuleLayout>
  );
}