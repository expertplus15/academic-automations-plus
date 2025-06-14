import { HrPageHeader } from "@/components/HrPageHeader";

export default function Hr() {
  return (
    <div className="min-h-screen bg-background">
      <HrPageHeader 
        title="Ressources Humaines" 
        subtitle="Gestion du personnel enseignant et administratif" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Tableau de Bord RH</h2>
            <p className="text-muted-foreground">
              Vue d'ensemble de la gestion des ressources humaines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}