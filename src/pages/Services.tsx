import React from 'react';
import { ServicesModuleLayout } from '@/components/layouts/ServicesModuleLayout';
import { ServicesDashboard } from '@/components/services/ServicesDashboard';

export default function Services() {
  return (
    <ServicesModuleLayout showHeader={false}>
      <ServicesDashboard />
    </ServicesModuleLayout>
  );
}