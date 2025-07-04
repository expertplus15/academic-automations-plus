import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { PropertyDashboard } from "@/components/resources/PropertyDashboard";

export default function Property() {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesPageHeader 
        title="Patrimoine immobilier" 
        subtitle="Suivi et valorisation" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <PropertyDashboard />
        </div>
      </div>
    </div>
  );
}