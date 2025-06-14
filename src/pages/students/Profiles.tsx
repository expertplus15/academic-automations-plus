import { StudentsPageHeader } from "@/components/StudentsPageHeader";

export default function Profiles() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Profils étudiants" 
        subtitle="Profils complets des étudiants" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Profils Étudiants</h2>
            <p className="text-muted-foreground">
              Interface de gestion des profils étudiants complets à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}