import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load exam pages
const Exams = React.lazy(() => import('@/pages/Exams'));
const ExamCreation = React.lazy(() => import('@/pages/exams/creation'));
const ExamsPlanning = React.lazy(() => import('@/pages/exams/Planning'));
const ExamsMonitoring = React.lazy(() => import('@/pages/exams/Monitoring'));

export default function ExamsRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Exams />} />
          <Route path="creation" element={<ExamCreation />} />
          <Route path="planning" element={<ExamsPlanning />} />
          <Route path="monitoring" element={<ExamsMonitoring />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}