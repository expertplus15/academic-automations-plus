import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { DocumentsPageHeader } from "@/components/DocumentsPageHeader";
import { DocumentsDashboard } from "@/components/documents/DocumentsDashboard";

export default function Documents() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher']}>
      <ModuleLayout>
        <DocumentsPageHeader 
          title="Gestion Documentaire" 
          subtitle="Service centralisé de gestion des documents" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <DocumentsDashboard />
          </div>
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}