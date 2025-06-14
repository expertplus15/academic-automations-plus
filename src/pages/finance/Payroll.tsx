import { FinancePageHeader } from "@/components/FinancePageHeader";

export default function Payroll() {
  return (
    <div className="min-h-screen bg-background">
      <FinancePageHeader 
        title="Paie enseignants" 
        subtitle="Gestion paie permanent/vacataire" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Paie Enseignants</h2>
            <p className="text-muted-foreground">
              Interface de gestion de la paie des enseignants à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}