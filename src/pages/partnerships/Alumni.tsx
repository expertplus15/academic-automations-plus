import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";

export default function Alumni() {
  return (
    <div className="min-h-screen bg-background">
      <PartnershipsPageHeader 
        title="Réseau alumni" 
        subtitle="Anciens étudiants & networking" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Réseau Alumni</h2>
            <p className="text-muted-foreground">
              Interface de gestion du réseau des anciens étudiants à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}