
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { AcademicTrackingDashboard } from "@/components/tracking/AcademicTrackingDashboard";

export default function Tracking() {
  return (
    <ModuleLayout 
      title="Suivi académique" 
      subtitle="Suivi en temps réel des performances et de l'assiduité des étudiants"
      showHeader={true}
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AcademicTrackingDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}
