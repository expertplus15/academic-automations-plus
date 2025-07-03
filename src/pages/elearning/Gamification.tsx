import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from "@/components/ElearningPageHeader";
import { GamificationDashboard } from '@/components/elearning/GamificationDashboard';

export default function Gamification() {
  // TODO: Get actual student ID from authentication context
  const studentId = "demo-student-id"; // Placeholder

  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8 space-y-8">
        <ElearningPageHeader 
          title="Gamification" 
          subtitle="Suivez votre progression, gagnez des badges et points de récompense" 
        />
        
        <GamificationDashboard studentId={studentId} />
      </div>
    </ModuleLayout>
  );
}