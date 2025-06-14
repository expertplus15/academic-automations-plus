import { HealthPageHeader } from "@/components/HealthPageHeader";

export default function Appointments() {
  return (
    <div className="min-h-screen bg-background">
      <HealthPageHeader 
        title="Planning consultations" 
        subtitle="Gestion infirmerie" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Planning Consultations</h2>
            <p className="text-muted-foreground">
              Interface de planning des consultations à l'infirmerie à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}