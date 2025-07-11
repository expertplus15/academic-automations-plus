import { ProtectedRoute } from '@/components/ProtectedRoute';
import StudentTestRunner from '@/components/test/StudentTestRunner';

export default function StudentTestRunnerPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr']}>
      <StudentTestRunner />
    </ProtectedRoute>
  );
}