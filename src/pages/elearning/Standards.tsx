import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from "@/components/ElearningPageHeader";
import { SCORMManager } from '@/components/elearning/SCORMManager';

export default function Standards() {
  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        <ElearningPageHeader 
          title="Standards SCORM/xAPI" 
          subtitle="Gestion des packages SCORM et standards e-learning" 
        />
        
        <SCORMManager />
      </div>
    </ModuleLayout>
  );
}