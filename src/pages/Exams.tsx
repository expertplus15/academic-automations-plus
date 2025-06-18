
import React from 'react';
import { ExamsPageHeader } from "@/components/ExamsPageHeader";
import { ExamDashboard } from '@/components/exams/ExamDashboard';

export default function Exams() {
  return (
    <div className="min-h-screen bg-background">
      <ExamsPageHeader 
        title="Module Examens IA" 
        subtitle="Gestion intelligente des examens avec IA anti-conflits" 
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <ExamDashboard />
        </div>
      </div>
    </div>
  );
}
