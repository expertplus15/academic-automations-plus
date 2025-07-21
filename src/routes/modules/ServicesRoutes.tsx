import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load service pages
const Services = React.lazy(() => import('@/pages/Services'));
const Transport = React.lazy(() => import('@/pages/services/Transport'));
const Catering = React.lazy(() => import('@/pages/services/Catering'));
const Accommodation = React.lazy(() => import('@/pages/services/Accommodation'));

export default function ServicesRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Services />} />
          <Route path="transport" element={<Transport />} />
          <Route path="catering" element={<Catering />} />
          <Route path="accommodation" element={<Accommodation />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}