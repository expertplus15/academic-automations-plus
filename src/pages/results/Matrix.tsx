import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { MatriceInterface } from "@/components/results/MatriceInterface";

export default function Matrix() {
  return (
    <ModuleLayout 
      title="Interface Matricielle" 
      subtitle="Saisie collaborative type Google Sheets - Édition simultanée"
      showHeader={true}
    >
      <div className="p-6">
        <MatriceInterface />
      </div>
    </ModuleLayout>
  );
}