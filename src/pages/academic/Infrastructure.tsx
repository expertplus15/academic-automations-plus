import { AcademicPageHeader } from "@/components/AcademicPageHeader";

export default function Infrastructure() {
  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Infrastructures" 
        subtitle="Salles et équipements" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Infrastructures</h2>
            <p className="text-muted-foreground">
              Interface de gestion des salles et équipements à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}