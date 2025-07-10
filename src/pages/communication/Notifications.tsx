import React, { useState } from 'react';
import { CommunicationModuleLayout } from '@/components/layouts/CommunicationModuleLayout';
import { NotificationsList } from '@/components/communication/NotificationsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NewNotificationModal } from '@/components/communication/NewNotificationModal';
import { Bell, Plus } from 'lucide-react';

export default function Notifications() {
  const [showNewNotification, setShowNewNotification] = useState(false);

  const headerActions = [
    {
      label: "Nouvelle notification",
      icon: Plus,
      onClick: () => setShowNewNotification(true),
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
      
      <NewNotificationModal
        open={showNewNotification}
        onClose={() => setShowNewNotification(false)}
      />
    </ProtectedRoute>
  );
}