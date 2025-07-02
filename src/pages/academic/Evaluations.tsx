import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';

export default function Evaluations() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Évaluations" 
        subtitle="Notes et bulletins"
        showHeader={true}
      >
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Évaluations</h2>
              <p className="text-muted-foreground">
                Interface de gestion des évaluations et notes à venir.
              </p>
            </div>
          </div>
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}