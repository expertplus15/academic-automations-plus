import { StudentsPageHeader } from "@/components/StudentsPageHeader";

export default function Alerts() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Alertes automatiques" 
        subtitle="Alertes pour absences et notes" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Alertes Automatiques</h2>
            <p className="text-muted-foreground">
              Interface de gestion des alertes automatiques à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}