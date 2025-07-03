import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from "@/components/ElearningPageHeader";
import { StreamingDashboard } from '@/components/elearning/StreamingDashboard';

export default function Streaming() {
  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        <ElearningPageHeader 
          title="Streaming Vidéo" 
          subtitle="Gestionnaire de contenu vidéo adaptatif avec analytics" 
        />
        
        <StreamingDashboard />
      </div>
    </ModuleLayout>
  );
}