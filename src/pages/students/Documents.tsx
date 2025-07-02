
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { DocumentsManagement } from '@/components/documents/DocumentsManagement';

export default function Documents() {
  return (
    <ModuleLayout 
      title="Documents Administratifs" 
      subtitle="Génération et gestion des certificats et documents officiels"
      showHeader={true}
    >
      <div className="p-6">
        <DocumentsManagement />
      </div>
    </ModuleLayout>
  );
}
