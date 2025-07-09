import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { CommunicationDashboard } from "@/components/communication/CommunicationDashboard";

export default function Communication() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <ModuleLayout>
        <CommunicationPageHeader 
          title="Communication & Relations" 
          subtitle="Messagerie, relations externes et communication interne" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <CommunicationDashboard />
          </div>
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}