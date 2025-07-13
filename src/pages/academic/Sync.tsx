import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { AcademicStudentSyncDashboard } from '@/components/sync/AcademicStudentSyncDashboard';

export default function AcademicSync() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Synchronisation"
      >
        <div className="space-y-6">
          <AcademicStudentSyncDashboard />
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}