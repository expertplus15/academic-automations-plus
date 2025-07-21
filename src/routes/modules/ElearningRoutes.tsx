import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load e-learning pages
const Elearning = React.lazy(() => import('@/pages/Elearning'));
const ElearningCourses = React.lazy(() => import('@/pages/elearning/Courses'));
const ElearningVirtualClasses = React.lazy(() => import('@/pages/elearning/VirtualClasses'));
const ElearningAnalytics = React.lazy(() => import('@/pages/elearning/Analytics'));

export default function ElearningRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Elearning />} />
          <Route path="courses" element={<ElearningCourses />} />
          <Route path="virtual-classes" element={<ElearningVirtualClasses />} />
          <Route path="analytics" element={<ElearningAnalytics />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}