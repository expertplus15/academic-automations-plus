import { PartnershipsModuleLayout } from "@/components/layouts/PartnershipsModuleLayout";
import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";

export default function Internships() {
  return (
    <PartnershipsModuleLayout>
      <PartnershipsPageHeader 
        title="Gestion stages" 
        subtitle="Stages & insertions professionnelles" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Stages</h2>
            <p className="text-muted-foreground">
              Interface de gestion des stages et insertions professionnelles à venir.
            </p>
          </div>
        </div>
      </div>
    </PartnershipsModuleLayout>
  );
}