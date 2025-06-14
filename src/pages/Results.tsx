import { ResultsPageHeader } from "@/components/ResultsPageHeader";

export default function Results() {
  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Évaluations & Résultats" 
        subtitle="Gestion des notes et bulletins" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Résultats</h2>
            <p className="text-muted-foreground">
              Vue d'ensemble des évaluations et résultats scolaires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}