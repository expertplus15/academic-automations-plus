
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { StudentsProfilesManagement } from "@/components/students/StudentsProfilesManagement";
import { AcademicYearProvider } from "@/contexts/AcademicYearContext";

export default function Profiles() {
  return (
    <AcademicYearProvider>
      <StudentsModuleLayout 
        title="Profils Étudiants" 
        subtitle="Gestion complète des profils et informations des étudiants"
        showHeader={true}
      >
        <div className="p-6">
          <StudentsProfilesManagement />
        </div>
      </StudentsModuleLayout>
    </AcademicYearProvider>
  );
}
