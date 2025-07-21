import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load settings pages
const Settings = React.lazy(() => import('@/pages/Settings'));
const SettingsGeneral = React.lazy(() => import('@/pages/settings/General'));
const SettingsUsers = React.lazy(() => import('@/pages/settings/Users'));
const SettingsAcademic = React.lazy(() => import('@/pages/settings/AcademicManagement'));
const SettingsInstitutions = React.lazy(() => import('@/pages/settings/Institutions'));
const SettingsCustomization = React.lazy(() => import('@/pages/settings/Customization'));
const SettingsIntegrations = React.lazy(() => import('@/pages/settings/Integrations'));
const SettingsMonitoring = React.lazy(() => import('@/pages/settings/Monitoring'));

export default function SettingsRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Settings />} />
          <Route path="general" element={<SettingsGeneral />} />
          <Route path="users" element={<SettingsUsers />} />
          <Route path="academic" element={<SettingsAcademic />} />
          <Route path="institutions" element={<SettingsInstitutions />} />
          <Route path="customization" element={<SettingsCustomization />} />
          <Route path="integrations" element={<SettingsIntegrations />} />
          <Route path="monitoring" element={<SettingsMonitoring />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}