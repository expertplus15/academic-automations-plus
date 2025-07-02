
import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ExamsDashboard } from '@/components/dashboard/ExamsDashboard';

export default function Exams() {
  return (
    <ModuleLayout 
      title="Module Examens IA" 
      subtitle="Gestion intelligente des examens avec IA anti-conflits"
      showHeader={true}
    >
      <div className="p-6">
        <ExamsDashboard />
      </div>
    </ModuleLayout>
  );
}
