import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";

export default function Inventory() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Inventaire numérique" 
        subtitle="QR codes et traçabilité" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Inventaire Numérique</h2>
            <p className="text-muted-foreground">
              Interface de gestion de l'inventaire avec QR codes et traçabilité à venir.
            </p>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}