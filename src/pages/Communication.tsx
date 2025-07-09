import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationDashboard } from "@/components/communication/CommunicationDashboard";

export default function Communication() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationDashboard />
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}