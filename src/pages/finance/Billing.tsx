import { FinancePageHeader } from "@/components/FinancePageHeader";

export default function Billing() {
  return (
    <div className="min-h-screen bg-background">
      <FinancePageHeader 
        title="Facturation automatique" 
        subtitle="Génération instantanée des factures" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Facturation Automatique</h2>
            <p className="text-muted-foreground">
              Interface de facturation automatique à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}