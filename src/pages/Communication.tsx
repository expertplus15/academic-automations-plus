import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { CommunicationBanner } from '@/components/communication/CommunicationBanner';
import { CommunicationStatusCards } from '@/components/communication/CommunicationStatusCards';
import { CommunicationModuleCards } from '@/components/communication/CommunicationModuleCards';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Communication() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <ModuleLayout>
        <div className="p-6 space-y-6">
          <CommunicationBanner />
          <CommunicationStatusCards />
          <CommunicationModuleCards />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}