import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load resource pages
const Resources = React.lazy(() => import('@/pages/Resources'));
const ResourcesInventory = React.lazy(() => import('@/pages/resources/Inventory'));
const ResourcesBookings = React.lazy(() => import('@/pages/resources/Bookings'));

export default function ResourcesRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Resources />} />
          <Route path="inventory" element={<ResourcesInventory />} />
          <Route path="bookings" element={<ResourcesBookings />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}