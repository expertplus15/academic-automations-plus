
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { CommunicationHub } from "@/components/communication/CommunicationHub";

export default function Communication() {
  return (
    <ModuleLayout 
      title="Communication Intégrée" 
      subtitle="Messagerie et notifications pour les étudiants"
      showHeader={true}
    >
      <div className="p-6">
        <CommunicationHub />
      </div>
    </ModuleLayout>
  );
}
