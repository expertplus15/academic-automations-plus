import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";

export default function Partnerships() {
  return (
    <div className="min-h-screen bg-background">
      <PartnershipsPageHeader 
        title="Relations & Partenariats" 
        subtitle="Gestion des partenaires et relations externes" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Partenariats</h2>
            <p className="text-muted-foreground">
              Vue d'ensemble des relations et partenariats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}