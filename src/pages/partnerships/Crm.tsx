import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";

export default function Crm() {
  return (
    <div className="min-h-screen bg-background">
      <PartnershipsPageHeader 
        title="CRM partenaires" 
        subtitle="Gestion des relations partenaires" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">CRM Partenaires</h2>
            <p className="text-muted-foreground">
              Interface de gestion des relations avec les partenaires à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}