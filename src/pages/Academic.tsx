import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { NewAcademicDashboard } from '@/components/academic/NewAcademicDashboard';

export default function Academic() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout>
        <NewAcademicDashboard />
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}