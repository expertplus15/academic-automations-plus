import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { AdminIntelligence } from '@/components/finance/AdminIntelligence';

export default function AdminIA() {
  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8">
        <AdminIntelligence />
      </div>
    </ModuleLayout>
  );
}