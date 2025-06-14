import { AcademicPageHeader } from "@/components/AcademicPageHeader";

export default function Timetables() {
  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Emploi du Temps" 
        subtitle="Planning intelligent" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Emploi du Temps</h2>
            <p className="text-muted-foreground">
              Interface de gestion des emplois du temps à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}