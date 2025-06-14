import { ExamsPageHeader } from "@/components/ExamsPageHeader";

export default function Planning() {
  return (
    <div className="min-h-screen bg-background">
      <ExamsPageHeader 
        title="Planification examens" 
        subtitle="IA anti-conflits pour la planification" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Planification des Examens</h2>
            <p className="text-muted-foreground">
              Interface de planification intelligente des examens à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}