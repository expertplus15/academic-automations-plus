import { ExamsPageHeader } from "@/components/ExamsPageHeader";

export default function Monitoring() {
  return (
    <div className="min-h-screen bg-background">
      <ExamsPageHeader 
        title="Surveillance temps réel" 
        subtitle="Sessions en cours de surveillance" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Surveillance Temps Réel</h2>
            <p className="text-muted-foreground">
              Interface de surveillance des sessions d'examens en temps réel à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}