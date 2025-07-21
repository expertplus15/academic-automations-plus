import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load academic pages
const Academic = React.lazy(() => import('@/pages/Academic'));
const AcademicPrograms = React.lazy(() => import('@/pages/academic/Programs'));
const AcademicSubjects = React.lazy(() => import('@/pages/academic/Subjects'));
const AcademicTimetables = React.lazy(() => import('@/pages/academic/Timetables'));
const AcademicCalendar = React.lazy(() => import('@/pages/academic/Calendar'));
const AcademicPathways = React.lazy(() => import('@/pages/academic/Pathways'));
const AcademicGroups = React.lazy(() => import('@/pages/academic/Groups'));
const AcademicLevels = React.lazy(() => import('@/pages/academic/Levels'));
const AcademicDepartments = React.lazy(() => import('@/pages/academic/Departments'));

export default function AcademicRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Academic />} />
          <Route path="programs" element={<AcademicPrograms />} />
          <Route path="subjects" element={<AcademicSubjects />} />
          <Route path="timetables" element={<AcademicTimetables />} />
          <Route path="calendar" element={<AcademicCalendar />} />
          <Route path="pathways" element={<AcademicPathways />} />
          <Route path="groups" element={<AcademicGroups />} />
          <Route path="levels" element={<AcademicLevels />} />
          <Route path="departments" element={<AcademicDepartments />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}