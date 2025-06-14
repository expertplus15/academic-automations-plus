import { StudentsPageHeader } from "@/components/StudentsPageHeader";

export default function Tracking() {
  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Suivi académique" 
        subtitle="Suivi en temps réel des étudiants" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Suivi Académique</h2>
            <p className="text-muted-foreground">
              Interface de suivi académique en temps réel à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}