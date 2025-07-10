import React, { Suspense } from 'react';
import { CommunicationModuleLayout } from '@/components/layouts/CommunicationModuleLayout';
import { AnnouncementsList } from '@/components/communication/AnnouncementsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Plus } from 'lucide-react';

export default function Announcements() {
  const headerActions = [
    {
      label: "Nouvelle annonce",
      icon: Plus,
      onClick: () => {},
      variant: 'default' as const
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationProvider>
        <CommunicationModuleLayout 
          showHeader={true}
          title="Annonces"
          subtitle="Annonces institutionnelles et informations importantes"
          actions={headerActions}
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
        </CommunicationModuleLayout>
      </CommunicationProvider>
    </ProtectedRoute>
  );
}