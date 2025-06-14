import { ExamsPageHeader } from "@/components/ExamsPageHeader";

export default function Incidents() {
  return (
    <div className="min-h-screen bg-background">
      <ExamsPageHeader 
        title="Incidents & PV" 
        subtitle="Gestion des problèmes et procès-verbaux" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Incidents & Procès-Verbaux</h2>
            <p className="text-muted-foreground">
              Interface de gestion des incidents et procès-verbaux à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}