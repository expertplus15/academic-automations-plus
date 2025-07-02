
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { StudentsProfilesManagement } from "@/components/students/StudentsProfilesManagement";

export default function Profiles() {
  return (
    <ModuleLayout 
      title="Profils Étudiants" 
      subtitle="Gestion complète des profils et informations des étudiants"
      showHeader={true}
    >
      <div className="p-6">
        <StudentsProfilesManagement />
      </div>
    </ModuleLayout>
  );
}
