import { HealthPageHeader } from "@/components/HealthPageHeader";

export default function Medications() {
  return (
    <div className="min-h-screen bg-background">
      <HealthPageHeader 
        title="Gestion médicaments" 
        subtitle="Prescriptions et dispensation" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion Médicaments</h2>
            <p className="text-muted-foreground">
              Interface de gestion des médicaments et prescriptions à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}