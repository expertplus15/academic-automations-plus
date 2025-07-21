import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load HR pages
const Hr = React.lazy(() => import('@/pages/Hr'));
const HrTeachers = React.lazy(() => import('@/pages/hr/Teachers'));
const HrContracts = React.lazy(() => import('@/pages/hr/Contracts'));

export default function HrRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Hr />} />
          <Route path="teachers" element={<HrTeachers />} />
          <Route path="contracts" element={<HrContracts />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}