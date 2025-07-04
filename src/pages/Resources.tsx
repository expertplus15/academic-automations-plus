import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";

export default function Resources() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Ressources & Patrimoine" 
        subtitle="Gestion des équipements et infrastructures" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Ressources</h2>
            <p className="text-muted-foreground">
              Vue d'ensemble des ressources et du patrimoine.
            </p>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}