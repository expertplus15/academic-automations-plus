import { AcademicPageHeader } from "@/components/AcademicPageHeader";

export default function Subjects() {
  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Cours" 
        subtitle="Gestion des matières" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Cours et Matières</h2>
            <p className="text-muted-foreground">
              Interface de gestion des cours et matières enseignées à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}