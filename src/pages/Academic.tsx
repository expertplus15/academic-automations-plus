import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicDashboard } from '@/components/academic/AcademicDashboard';

export default function Academic() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicDashboard />
    </ProtectedRoute>
  );
}