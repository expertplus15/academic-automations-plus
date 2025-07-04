import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { CommunicationDashboard } from "@/components/communication/CommunicationDashboard";

export default function Communication() {
  return (
    <CommunicationModuleLayout>
      <CommunicationPageHeader 
        title="Communication & Relations" 
        subtitle="Messagerie, relations externes et communication interne" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <CommunicationDashboard />
        </div>
      </div>
    </CommunicationModuleLayout>
  );
}