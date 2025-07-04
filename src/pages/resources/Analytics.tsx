import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { AnalyticsDashboard } from "@/components/resources/AnalyticsDashboard";

export default function Analytics() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Rapports & analyses" 
        subtitle="Statistiques et KPIs" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AnalyticsDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}