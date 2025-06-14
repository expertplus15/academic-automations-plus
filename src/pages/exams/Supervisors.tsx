import { ExamsPageHeader } from "@/components/ExamsPageHeader";

export default function Supervisors() {
  return (
    <div className="min-h-screen bg-background">
      <ExamsPageHeader 
        title="Attribution surveillants" 
        subtitle="Attribution automatique des surveillants" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Attribution des Surveillants</h2>
            <p className="text-muted-foreground">
              Interface d'attribution automatique des surveillants à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}