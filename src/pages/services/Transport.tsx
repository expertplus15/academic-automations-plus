import { ServicesPageHeader } from "@/components/ServicesPageHeader";

export default function Transport() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesPageHeader 
        title="Transport scolaire" 
        subtitle="Lignes & réservations" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Transport Scolaire</h2>
            <p className="text-muted-foreground">
              Interface de gestion du transport scolaire et réservations à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}