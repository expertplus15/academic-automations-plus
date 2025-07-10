import React, { Suspense } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { CommunicationBanner } from '@/components/communication/CommunicationBanner';
import { CommunicationStatusCards } from '@/components/communication/CommunicationStatusCards';
import { CommunicationModuleCards } from '@/components/communication/CommunicationModuleCards';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Communication() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationProvider>
        <ModuleLayout>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          }>
            <div className="p-6 space-y-6">
              <CommunicationBanner />
              <CommunicationStatusCards />
              <CommunicationModuleCards />
            </div>
          </Suspense>
        </ModuleLayout>
      </CommunicationProvider>
    </ProtectedRoute>
  );
}