import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load communication pages
const Messaging = React.lazy(() => import('@/pages/communication/Messaging'));
const Announcements = React.lazy(() => import('@/pages/communication/Announcements'));
const Notifications = React.lazy(() => import('@/pages/communication/Notifications'));
const Directory = React.lazy(() => import('@/pages/communication/Directory'));
const Calls = React.lazy(() => import('@/pages/communication/Calls'));
const Campaigns = React.lazy(() => import('@/pages/communication/Campaigns'));
const Events = React.lazy(() => import('@/pages/communication/Events'));

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
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}