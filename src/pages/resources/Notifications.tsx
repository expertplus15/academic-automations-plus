import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { NotificationCenter } from "@/components/resources/NotificationCenter";

export default function Notifications() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Centre de notifications" 
        subtitle="Alertes et notifications temps réel" 
      />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <NotificationCenter />
        </div>
      </div>
    </ModuleLayout>
  );
}