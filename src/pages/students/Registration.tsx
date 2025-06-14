import { StudentsPageHeader } from "@/components/StudentsPageHeader";

export default function Registration() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Inscription automatisée" 
        subtitle="Processus d'inscription en moins de 30 secondes" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Inscription Automatisée</h2>
            <p className="text-muted-foreground">
              Interface de gestion des inscriptions étudiantes automatisées à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}