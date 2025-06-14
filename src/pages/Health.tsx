import { HealthPageHeader } from "@/components/HealthPageHeader";

export default function Health() {
  return (
    <div className="min-h-screen bg-background">
      <HealthPageHeader 
        title="Gestion Santé" 
        subtitle="Suivi médical et bien-être des étudiants" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Tableau de Bord Santé</h2>
            <p className="text-muted-foreground">
              Vue d'ensemble de la gestion de la santé et du bien-être.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}