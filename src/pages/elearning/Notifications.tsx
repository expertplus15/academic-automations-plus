import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from "@/components/ElearningPageHeader";
import { NotificationCenter } from '@/components/elearning/NotificationCenter';

export default function Notifications() {
  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        <ElearningPageHeader 
          title="Centre de Notifications" 
          subtitle="Gérez vos notifications et paramètres de communication" 
        />
        
        <NotificationCenter />
      </div>
    </ModuleLayout>
  );
}