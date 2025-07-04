import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { MaintenanceDashboard } from "@/components/resources/MaintenanceDashboard";

export default function Maintenance() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Maintenance préventive" 
        subtitle="Maintenance automatisée" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <MaintenanceDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}