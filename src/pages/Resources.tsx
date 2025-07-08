import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { ResourcesDashboard } from "@/components/resources/ResourcesDashboard";

export default function Resources() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher']}>
      <ModuleLayout>
        <ResourcesPageHeader 
          title="Ressources & Patrimoine" 
          subtitle="Gestion des équipements et infrastructures" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <ResourcesDashboard />
          </div>
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}