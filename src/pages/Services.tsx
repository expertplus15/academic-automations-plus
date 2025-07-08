import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ServicesModuleLayout } from '@/components/layouts/ServicesModuleLayout';
import { ServicesDashboard } from '@/components/services/ServicesDashboard';

export default function Services() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <ServicesModuleLayout showHeader={false}>
        <ServicesDashboard />
      </ServicesModuleLayout>
    </ProtectedRoute>
  );
}