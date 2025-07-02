
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { InfrastructuresList } from "@/components/infrastructure/InfrastructuresList";

export default function Infrastructure() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Infrastructures" 
        subtitle="Gestion des salles et équipements"
        showHeader={true}
      >
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <InfrastructuresList />
          </div>
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}
