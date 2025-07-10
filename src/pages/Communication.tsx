import React from 'react';
import { CommunicationBanner } from '@/components/communication/CommunicationBanner';
import { CommunicationStatusCards } from '@/components/communication/CommunicationStatusCards';
import { CommunicationModuleCards } from '@/components/communication/CommunicationModuleCards';

export default function Communication() {
  return (
    <div className="p-6 space-y-6">
      <CommunicationBanner />
      <CommunicationStatusCards />
      <CommunicationModuleCards />
    </div>
  );
}