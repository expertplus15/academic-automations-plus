import { FinancePageHeader } from "@/components/FinancePageHeader";

export default function Budgets() {
  return (
    <div className="min-h-screen bg-background">
      <FinancePageHeader 
        title="Budgets & prévisions" 
        subtitle="Planification budgétaire" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Budgets & Prévisions</h2>
            <p className="text-muted-foreground">
              Interface de planification budgétaire à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}