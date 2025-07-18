import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { DutgeStudentImporter } from '@/components/academic/DutgeStudentImporter';

export default function DutgeImport() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout>
        <DutgeStudentImporter />
      </ModuleLayout>
    </ProtectedRoute>
  );
}