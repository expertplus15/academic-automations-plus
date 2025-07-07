import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { ManagementIntelligence as ManagementIntelligenceComponent } from '@/components/finance/ManagementIntelligence';

export default function ManagementIntelligence() {
  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8">
        <ManagementIntelligenceComponent />
      </div>
    </ModuleLayout>
  );
}