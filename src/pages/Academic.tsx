import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { NewAcademicDashboard } from '@/components/academic/NewAcademicDashboard';

export default function Academic() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout>
        <NewAcademicDashboard />
      </ModuleLayout>
    </ProtectedRoute>
  );
}