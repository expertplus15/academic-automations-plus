import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";

export default function International() {
  return (
    <div className="min-h-screen bg-background">
      <PartnershipsPageHeader 
        title="Échanges internationaux" 
        subtitle="Programmes de mobilité" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Échanges Internationaux</h2>
            <p className="text-muted-foreground">
              Interface de gestion des programmes de mobilité internationale à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}