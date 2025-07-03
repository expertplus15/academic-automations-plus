import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from "@/components/ElearningPageHeader";
import { VirtualClassManager } from '@/components/elearning/VirtualClassManager';

export default function VirtualClasses() {
  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        <ElearningPageHeader 
          title="Classes Virtuelles" 
          subtitle="Gérez vos sessions de cours en ligne avec Zoom et Teams" 
        />
        
        <VirtualClassManager />
      </div>
    </ModuleLayout>
  );
}