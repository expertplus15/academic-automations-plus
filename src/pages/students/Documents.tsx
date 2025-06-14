import { StudentsPageHeader } from "@/components/StudentsPageHeader";

export default function Documents() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Documents administratifs" 
        subtitle="Certificats et documents officiels" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Documents Administratifs</h2>
            <p className="text-muted-foreground">
              Interface de gestion des documents administratifs à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}