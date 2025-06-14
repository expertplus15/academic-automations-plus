import { HrPageHeader } from "@/components/HrPageHeader";

export default function Teachers() {
  return (
    <div className="min-h-screen bg-background">
      <HrPageHeader 
        title="Gestion enseignants" 
        subtitle="Référentiel centralisé des enseignants" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Enseignants</h2>
            <p className="text-muted-foreground">
              Interface de gestion du référentiel enseignants à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}