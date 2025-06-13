import { AcademicPageHeader } from "@/components/AcademicPageHeader";

export default function Levels() {
  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Niveaux d'Études" 
        subtitle="Structure des niveaux" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Niveaux d'Études</h2>
            <p className="text-muted-foreground">
              Interface de gestion des niveaux d'études à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}