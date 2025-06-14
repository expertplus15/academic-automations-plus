import { ResultsPageHeader } from "@/components/ResultsPageHeader";

export default function Calculations() {
  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Calculs automatiques" 
        subtitle="Moyennes, ECTS et coefficients" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Calculs Automatiques</h2>
            <p className="text-muted-foreground">
              Interface de calculs automatiques des moyennes et ECTS à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}