import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { NotificationsList } from '@/components/communication/NotificationsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Bell, Plus } from 'lucide-react';

export default function Notifications() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <ModuleLayout 
        showHeader={true}
        title="Centre de Notifications"
        subtitle="Gérez vos notifications et alertes"
      >
        <div className="p-6">
          <NotificationsList />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}