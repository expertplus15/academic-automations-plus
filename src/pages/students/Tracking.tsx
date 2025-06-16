
import { StudentsPageHeader } from "@/components/StudentsPageHeader";
import { AcademicTrackingDashboard } from "@/components/tracking/AcademicTrackingDashboard";

export default function Tracking() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Suivi académique" 
        subtitle="Suivi en temps réel des performances et de l'assiduité des étudiants" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AcademicTrackingDashboard />
        </div>
      </div>
    </div>
  );
}
