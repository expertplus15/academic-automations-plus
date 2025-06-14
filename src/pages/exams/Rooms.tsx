import { ExamsPageHeader } from "@/components/ExamsPageHeader";

export default function Rooms() {
  return (
    <div className="min-h-screen bg-background">
      <ExamsPageHeader 
        title="Gestion salles" 
        subtitle="Capacités et attribution des salles" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Salles</h2>
            <p className="text-muted-foreground">
              Interface de gestion des salles d'examens à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}