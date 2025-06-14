import { HrPageHeader } from "@/components/HrPageHeader";

export default function Availability() {
  return (
    <div className="min-h-screen bg-background">
      <HrPageHeader 
        title="Disponibilités" 
        subtitle="Planning des créneaux disponibles" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Disponibilités</h2>
            <p className="text-muted-foreground">
              Interface de gestion des disponibilités et planning des créneaux à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}