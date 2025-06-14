import { ResultsPageHeader } from "@/components/ResultsPageHeader";

export default function ResultsAnalytics() {
  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Analytics performance" 
        subtitle="Insights et métriques avancés" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics Performance</h2>
            <p className="text-muted-foreground">
              Interface d'analytics et insights de performance à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}