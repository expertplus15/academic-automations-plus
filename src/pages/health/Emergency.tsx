import { HealthPageHeader } from "@/components/HealthPageHeader";

export default function Emergency() {
  return (
    <div className="min-h-screen bg-background">
      <HealthPageHeader 
        title="Protocoles d'urgence" 
        subtitle="Procédures d'urgence médicale" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Protocoles d'Urgence</h2>
            <p className="text-muted-foreground">
              Interface de gestion des protocoles d'urgence médicale à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}