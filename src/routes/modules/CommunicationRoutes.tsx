import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load communication pages
const Communication = React.lazy(() => import('@/pages/Communication'));
const Messaging = React.lazy(() => import('@/pages/communication/Messaging'));
const Announcements = React.lazy(() => import('@/pages/communication/Announcements'));

export default function CommunicationRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Communication />} />
          <Route path="messaging" element={<Messaging />} />
          <Route path="announcements" element={<Announcements />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}