
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { StudentsDashboard } from "@/components/dashboard/StudentsDashboard";

export default function Students() {
  return (
    <ModuleLayout 
      title="Gestion des Étudiants" 
      subtitle="Tableau de bord principal du module étudiants"
      showHeader={true}
    >
      <div className="p-6">
        <StudentsDashboard />
      </div>
    </ModuleLayout>
  );
}
