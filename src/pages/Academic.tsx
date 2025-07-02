import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { AcademicDashboard } from '@/components/academic/AcademicDashboard';

export default function Academic() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Module Académique" 
        subtitle="Tableau de bord principal et gestion des programmes"
        showHeader={true}
      >
        <AcademicDashboard />
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}