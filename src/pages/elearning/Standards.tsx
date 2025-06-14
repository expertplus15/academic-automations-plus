import { ElearningPageHeader } from "@/components/ElearningPageHeader";

export default function Standards() {
  return (
    <div className="min-h-screen bg-background">
      <ElearningPageHeader 
        title="Standards SCORM/xAPI" 
        subtitle="Compatibilité standards e-learning" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Standards SCORM/xAPI</h2>
            <p className="text-muted-foreground">
              Interface de gestion des standards e-learning à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}