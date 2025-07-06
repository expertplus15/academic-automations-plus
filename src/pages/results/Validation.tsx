import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ValidationDashboard } from "@/components/results/ValidationDashboard";

export default function Validation() {
  return (
    <ModuleLayout 
      title="Validation & Contrôle" 
      subtitle="Validation automatique et contrôle qualité des données"
      showHeader={true}
    >
      <div className="p-6">
        <ValidationDashboard />
      </div>
    </ModuleLayout>
  );
}