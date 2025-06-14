import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";

export default function Bookings() {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesPageHeader 
        title="Réservation salles" 
        subtitle="Salles & équipements" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Réservation Salles</h2>
            <p className="text-muted-foreground">
              Interface de réservation des salles et équipements à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}