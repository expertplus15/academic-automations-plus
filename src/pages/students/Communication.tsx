import { StudentsPageHeader } from "@/components/StudentsPageHeader";

export default function Communication() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Communication intégrée" 
        subtitle="Messagerie et communication" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Communication Intégrée</h2>
            <p className="text-muted-foreground">
              Interface de communication et messagerie intégrée à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}