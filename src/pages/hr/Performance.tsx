import { HrPageHeader } from "@/components/HrPageHeader";

export default function Performance() {
  return (
    <div className="min-h-screen bg-background">
      <HrPageHeader 
        title="Performance" 
        subtitle="Évaluations et performances" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Performance</h2>
            <p className="text-muted-foreground">
              Interface d'évaluation des performances à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}