import { PartnershipsModuleLayout } from "@/components/layouts/PartnershipsModuleLayout";
import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";
import { PartnershipsDashboard } from "@/components/partnerships/PartnershipsDashboard";

export default function Partnerships() {
  return (
    <PartnershipsModuleLayout>
      <PartnershipsPageHeader 
        title="Relations & Partenariats" 
        subtitle="Gestion des partenaires et relations externes" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <PartnershipsDashboard />
        </div>
      </div>
    </PartnershipsModuleLayout>
  );
}