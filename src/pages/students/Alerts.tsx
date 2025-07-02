
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { AlertsManagement } from '@/components/alerts/AlertsManagement';

export default function Alerts() {
  return (
    <ModuleLayout 
      title="Alertes Automatiques" 
      subtitle="Système d'alertes intelligent pour le suivi des étudiants"
      showHeader={true}
    >
      <div className="p-6">
        <AlertsManagement />
      </div>
    </ModuleLayout>
  );
}
