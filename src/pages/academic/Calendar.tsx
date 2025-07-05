import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { DynamicAcademicCalendar } from '@/components/academic/DynamicAcademicCalendar';

export default function Calendar() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Calendrier Académique" 
        subtitle="Gestion du calendrier et des événements académiques"
        showHeader={true}
      >
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <DynamicAcademicCalendar />
          </div>
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}