
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ResultsLayout() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    </ProtectedRoute>
  );
}
