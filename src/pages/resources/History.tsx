import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { HistoryDashboard } from "@/components/resources/HistoryDashboard";

export default function History() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Historique des mouvements" 
        subtitle="Traçabilité complète" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <HistoryDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}