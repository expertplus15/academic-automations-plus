import { HrPageHeader } from "@/components/HrPageHeader";

export default function Contracts() {
  return (
    <div className="min-h-screen bg-background">
      <HrPageHeader 
        title="Types de contrats" 
        subtitle="Gestion permanent/vacataire" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Types de Contrats</h2>
            <p className="text-muted-foreground">
              Interface de gestion des types de contrats à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}