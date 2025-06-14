import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";

export default function Internships() {
  return (
    <div className="min-h-screen bg-background">
      <PartnershipsPageHeader 
        title="Gestion stages" 
        subtitle="Stages & insertions professionnelles" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Stages</h2>
            <p className="text-muted-foreground">
              Interface de gestion des stages et insertions professionnelles à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}