import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { AnalyticsInsightsDashboard } from "@/components/results/AnalyticsInsightsDashboard";

export default function AnalyticsInsights() {
  return (
    <ModuleLayout 
      title="Analytics & Insights" 
      subtitle="Tableau de bord unifié avec analyse de performance et intelligence artificielle"
      showHeader={true}
    >
      <div className="p-6">
        <AnalyticsInsightsDashboard />
      </div>
    </ModuleLayout>
  );
}