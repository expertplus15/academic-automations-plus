import React from 'react';
import { ExamsModuleLayout } from '@/components/layouts/ExamsModuleLayout';
import { CreationWizard } from '@/components/exams/creation/CreationWizard';

export default function ExamCreation() {
  return (
    <ExamsModuleLayout 
      title="Création d'Examen"
      subtitle="Assistant intelligent de création d'examens avec planification optimisée"
    >
      <div className="p-8">
        <CreationWizard />
      </div>
    </ExamsModuleLayout>
  );
}