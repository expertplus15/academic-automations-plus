import React from 'react';
import { CommunicationModuleLayout } from '@/components/layouts/CommunicationModuleLayout';
import { NotificationsList } from '@/components/communication/NotificationsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Bell, Plus } from 'lucide-react';

export default function Notifications() {
  const headerActions = [
    {
      label: "Nouvelle notification",
      icon: Plus,
      onClick: () => {},
      variant: 'default' as const
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationModuleLayout 
        showHeader={true}
        title="Centre de Notifications"
        subtitle="Gérez vos notifications et alertes"
        actions={headerActions}
      >
        <div className="p-6">
          <NotificationsList />
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}