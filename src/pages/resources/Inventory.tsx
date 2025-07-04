import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { InventoryDashboard } from "@/components/resources/InventoryDashboard";

export default function Inventory() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Inventaire numérique" 
        subtitle="QR codes et traçabilité" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <InventoryDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}