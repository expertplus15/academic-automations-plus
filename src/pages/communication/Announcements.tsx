import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { AnnouncementsList } from '@/components/communication/AnnouncementsList';

export default function Announcements() {
  return (
    <ModuleLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Annonces</h1>
          <p className="text-muted-foreground">Annonces institutionnelles et informations importantes</p>
        </div>
        
        <AnnouncementsList />
      </div>
    </ModuleLayout>
  );
}