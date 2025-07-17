
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy loaded pages avec organisation améliorée
import {
  IndexPage,
  LoginPage,
  SignupPage,
  ResetPasswordPage,
  DashboardPage,
  NotFoundPage,
  UnauthorizedPage,
} from '@/routes/lazy';

// Module routes
import { ModuleRoutes } from '@/routes/ModuleRoutes';

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <IndexPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
        <Route path="/reset-password" element={user ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Module routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <ModuleRoutes />
          </ProtectedRoute>
        } />
        
        {/* Error routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
