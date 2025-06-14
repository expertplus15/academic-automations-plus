import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { ProgramsList } from '@/components/academic/ProgramsList';
import { usePrograms } from '@/hooks/useSupabase';

export default function Programs() {
  const { data: programs, loading } = usePrograms();

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <div className="min-h-screen bg-background">
        <AcademicPageHeader 
          title="Programmes" 
          subtitle="Gestion des programmes d'études" 
        />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <ProgramsList programs={programs} loading={loading} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}