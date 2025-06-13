import { AcademicPageHeader } from "@/components/AcademicPageHeader";

export default function Pathways() {
  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Filières" 
        subtitle="Organisation des filières" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Filières Académiques</h2>
            <p className="text-muted-foreground">
              Interface de gestion des filières à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}