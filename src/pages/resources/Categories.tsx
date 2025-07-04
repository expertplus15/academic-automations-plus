import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { CategoriesDashboard } from "@/components/resources/CategoriesDashboard";

export default function Categories() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Catégories d'équipements" 
        subtitle="Classification et organisation" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <CategoriesDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}