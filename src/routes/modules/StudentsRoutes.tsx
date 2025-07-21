import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load student pages
const Students = React.lazy(() => import('@/pages/Students'));
const StudentsRegistration = React.lazy(() => import('@/pages/students/Registration'));
const StudentsProfiles = React.lazy(() => import('@/pages/students/Profiles'));
const StudentsTracking = React.lazy(() => import('@/pages/students/Tracking'));
const StudentsCards = React.lazy(() => import('@/pages/students/Cards'));
const StudentsAnalytics = React.lazy(() => import('@/pages/students/Analytics'));
const StudentsImport = React.lazy(() => import('@/pages/students/Import'));

export default function StudentsRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Students />} />
          <Route path="registration" element={<StudentsRegistration />} />
          <Route path="profiles" element={<StudentsProfiles />} />
          <Route path="tracking" element={<StudentsTracking />} />
          <Route path="cards" element={<StudentsCards />} />
          <Route path="analytics" element={<StudentsAnalytics />} />
          <Route path="import" element={<StudentsImport />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}