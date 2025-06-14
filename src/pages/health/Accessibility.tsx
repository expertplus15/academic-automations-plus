import { HealthPageHeader } from "@/components/HealthPageHeader";

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <HealthPageHeader 
        title="Aménagements handicap" 
        subtitle="PAI et aménagements spéciaux" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Aménagements Handicap</h2>
            <p className="text-muted-foreground">
              Interface de gestion des PAI et aménagements pour le handicap à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}