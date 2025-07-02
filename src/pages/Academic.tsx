import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { AcademicDashboardNew } from '@/components/dashboard/AcademicDashboardNew';

export default function Academic() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Module Académique" 
        subtitle="Tableau de bord principal et gestion des programmes"
        showHeader={true}
      >
        <div className="p-6">
          <AcademicDashboardNew />
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}