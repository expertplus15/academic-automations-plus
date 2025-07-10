import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { NotificationsList } from '@/components/communication/NotificationsList';

export default function Notifications() {
  return (
    <ModuleLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Centre de Notifications</h1>
          <p className="text-muted-foreground">Gérez vos notifications et alertes</p>
        </div>
        
        <NotificationsList />
      </div>
    </ModuleLayout>
  );
}