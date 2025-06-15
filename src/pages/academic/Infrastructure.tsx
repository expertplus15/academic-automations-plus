
import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { InfrastructuresList } from "@/components/infrastructure/InfrastructuresList";

export default function Infrastructure() {
  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Infrastructures" 
        subtitle="Gestion des salles et équipements" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <InfrastructuresList />
        </div>
      </div>
    </div>
  );
}
