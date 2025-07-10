import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { CommunicationBanner } from '@/components/communication/CommunicationBanner';
import { CommunicationStatusCards } from '@/components/communication/CommunicationStatusCards';
import { CommunicationModuleCards } from '@/components/communication/CommunicationModuleCards';

export default function Communication() {
  return (
    <ModuleLayout>
      <div className="p-6 space-y-6">
        <CommunicationBanner />
        <CommunicationStatusCards />
        <CommunicationModuleCards />
      </div>
    </ModuleLayout>
  );
}