import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';

export default function Results() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout 
        title="Évaluations & Résultats" 
        subtitle="Système de notation automatisé et interface matricielle collaborative"
        showHeader={true}
      >
        <div className="p-6">
          <ResultsDashboard />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}