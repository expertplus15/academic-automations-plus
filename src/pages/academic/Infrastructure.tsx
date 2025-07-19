
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { InfrastructuresList } from "@/components/infrastructure/InfrastructuresList";
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Infrastructure() {
  console.log('🔍 [DIAGNOSTIC] Page Infrastructure académique - Rendu');
  
  return (
    <ErrorBoundary>
      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
        <AcademicModuleLayout 
          title="Infrastructures" 
          subtitle="Gestion des salles et équipements"
          showHeader={true}
        >
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">🔍 Diagnostic en cours</h3>
                <p className="text-sm text-blue-700">
                  Cette page inclut maintenant des logs de diagnostic détaillés. 
                  Ouvrez la console développeur (F12) pour voir les informations de débogage.
                </p>
              </div>
              <InfrastructuresList />
            </div>
          </div>
        </AcademicModuleLayout>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
