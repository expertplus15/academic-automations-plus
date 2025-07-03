import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ProgramCalculationsView } from "@/components/results/ProgramCalculationsView";

export default function Calculations() {
  return (
    <ModuleLayout 
      title="Calculs et Relevés" 
      subtitle="Calculs automatiques des moyennes et génération des relevés de notes"
      showHeader={true}
    >
      <div className="p-6">
        <ProgramCalculationsView />
      </div>
    </ModuleLayout>
  );
}