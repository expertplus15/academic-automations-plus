import { ResultsPageHeader } from "@/components/ResultsPageHeader";

export default function Reports() {
  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Bulletins personnalisables" 
        subtitle="Génération en moins de 5 secondes" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Bulletins Personnalisables</h2>
            <p className="text-muted-foreground">
              Interface de génération de bulletins personnalisables à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}