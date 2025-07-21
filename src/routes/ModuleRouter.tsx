import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Module route components
import FinanceRoutes from './modules/FinanceRoutes';
import StudentsRoutes from './modules/StudentsRoutes';
import AcademicRoutes from './modules/AcademicRoutes';
import ResultsRoutes from './modules/ResultsRoutes';
import ExamsRoutes from './modules/ExamsRoutes';
import ElearningRoutes from './modules/ElearningRoutes';
import HrRoutes from './modules/HrRoutes';
import ResourcesRoutes from './modules/ResourcesRoutes';
import ServicesRoutes from './modules/ServicesRoutes';
import CommunicationRoutes from './modules/CommunicationRoutes';
import SettingsRoutes from './modules/SettingsRoutes';

// Standalone pages
const Documents = React.lazy(() => import('@/pages/Documents'));
const Partnerships = React.lazy(() => import('@/pages/Partnerships'));
const Organization = React.lazy(() => import('@/pages/Organization'));

export function ModuleRouter() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        {/* Module routes */}
        <Route path="/finance/*" element={<FinanceRoutes />} />
        <Route path="/students/*" element={<StudentsRoutes />} />
        <Route path="/academic/*" element={<AcademicRoutes />} />
        <Route path="/results/*" element={<ResultsRoutes />} />
        <Route path="/exams/*" element={<ExamsRoutes />} />
        <Route path="/elearning/*" element={<ElearningRoutes />} />
        <Route path="/hr/*" element={<HrRoutes />} />
        <Route path="/resources/*" element={<ResourcesRoutes />} />
        <Route path="/services/*" element={<ServicesRoutes />} />
        <Route path="/communication/*" element={<CommunicationRoutes />} />
        <Route path="/settings/*" element={<SettingsRoutes />} />
        
        {/* Standalone pages */}
        <Route 
          path="/documents" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Documents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/partnerships" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Partnerships />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/organization" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Organization />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
}