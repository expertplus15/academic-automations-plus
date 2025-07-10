import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { NotificationsList } from '@/components/communication/NotificationsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Notifications() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <ModuleLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Centre de Notifications</h1>
            <p className="text-muted-foreground">Gérez vos notifications et alertes</p>
          </div>
          
          <NotificationsList />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}