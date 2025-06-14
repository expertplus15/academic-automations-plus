import { HrPageHeader } from "@/components/HrPageHeader";

export default function Specialties() {
  return (
    <div className="min-h-screen bg-background">
      <HrPageHeader 
        title="Spécialités & matières" 
        subtitle="Domaines d'expertise" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Spécialités & Matières</h2>
            <p className="text-muted-foreground">
              Interface de gestion des spécialités et domaines d'expertise à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}