import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { SettingsDashboard } from "@/components/resources/SettingsDashboard";

export default function Settings() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Configuration" 
        subtitle="Paramètres et configuration du module" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <SettingsDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}