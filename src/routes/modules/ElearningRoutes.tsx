import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load e-learning pages
const Elearning = React.lazy(() => import('@/pages/Elearning'));
const ElearningCourses = React.lazy(() => import('@/pages/elearning/Courses'));
const ElearningStandards = React.lazy(() => import('@/pages/elearning/Standards'));
const ElearningAuthoring = React.lazy(() => import('@/pages/elearning/Authoring'));
const ElearningVirtualClasses = React.lazy(() => import('@/pages/elearning/VirtualClasses'));
const ElearningStreaming = React.lazy(() => import('@/pages/elearning/Streaming'));
const ElearningForums = React.lazy(() => import('@/pages/elearning/Forums'));
const ElearningGamification = React.lazy(() => import('@/pages/elearning/Gamification'));
const ElearningNotifications = React.lazy(() => import('@/pages/elearning/Notifications'));
const ElearningAnalytics = React.lazy(() => import('@/pages/elearning/Analytics'));

export default function ElearningRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Elearning />} />
          <Route path="courses" element={<ElearningCourses />} />
          <Route path="standards" element={<ElearningStandards />} />
          <Route path="authoring" element={<ElearningAuthoring />} />
          <Route path="virtual-classes" element={<ElearningVirtualClasses />} />
          <Route path="streaming" element={<ElearningStreaming />} />
          <Route path="forums" element={<ElearningForums />} />
          <Route path="gamification" element={<ElearningGamification />} />
          <Route path="notifications" element={<ElearningNotifications />} />
          <Route path="analytics" element={<ElearningAnalytics />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}