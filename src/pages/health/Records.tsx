import { HealthPageHeader } from "@/components/HealthPageHeader";

export default function Records() {
  return (
    <div className="min-h-screen bg-background">
      <HealthPageHeader 
        title="Dossiers médicaux" 
        subtitle="Dossiers sécurisés RGPD" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Dossiers Médicaux</h2>
            <p className="text-muted-foreground">
              Interface de gestion des dossiers médicaux sécurisés à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}