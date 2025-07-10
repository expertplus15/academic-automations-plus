import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load communication pages
const Messaging = React.lazy(() => import('@/pages/communication/Messaging'));
const Announcements = React.lazy(() => import('@/pages/communication/Announcements'));

// Loading fallback component
const CommunicationLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner />
  </div>
);

export default function CommunicationRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <Suspense fallback={<CommunicationLoading />}>
        <Routes>
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/announcements" element={<Announcements />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}