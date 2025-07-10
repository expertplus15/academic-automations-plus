import React, { Suspense } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { AnnouncementsList } from '@/components/communication/AnnouncementsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Announcements() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationProvider>
        <ModuleLayout 
          showHeader={true}
          title="Annonces"
          subtitle="Annonces institutionnelles et informations importantes"
        >
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          }>
            <div className="p-6">
              <AnnouncementsList />
            </div>
          </Suspense>
        </ModuleLayout>
      </CommunicationProvider>
    </ProtectedRoute>
  );
}