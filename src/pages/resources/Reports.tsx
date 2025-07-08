import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { ReportGenerator } from "@/components/resources/ReportGenerator";

export default function Reports() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Rapports & Analyses" 
        subtitle="Génération de rapports asynchrone" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <ReportGenerator />
        </div>
      </div>
    </ModuleLayout>
  );
}