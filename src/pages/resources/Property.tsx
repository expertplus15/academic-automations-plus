import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { PropertyDashboard } from "@/components/resources/PropertyDashboard";

export default function Property() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Patrimoine immobilier" 
        subtitle="Gestion complète des biens immobiliers" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <PropertyDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}