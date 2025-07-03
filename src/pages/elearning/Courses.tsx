import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from '@/components/ElearningPageHeader';
import { CourseManagement } from '@/components/elearning/CourseManagement';

export default function Courses() {
  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        <ElearningPageHeader 
          title="Gestion des Cours" 
          subtitle="Créez et gérez vos cours en ligne" 
        />
        
        <CourseManagement />
      </div>
    </ModuleLayout>
  );
}