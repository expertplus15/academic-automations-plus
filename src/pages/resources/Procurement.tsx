import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { ProcurementDashboard } from "@/components/resources/ProcurementDashboard";

export default function Procurement() {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesPageHeader 
        title="Achats & approvisionnements" 
        subtitle="Gestion des commandes" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <ProcurementDashboard />
        </div>
      </div>
    </div>
  );
}