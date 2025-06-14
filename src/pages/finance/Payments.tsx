import { FinancePageHeader } from "@/components/FinancePageHeader";

export default function Payments() {
  return (
    <div className="min-h-screen bg-background">
      <FinancePageHeader 
        title="Gestion paiements" 
        subtitle="Suivi et traitement des paiements" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Paiements</h2>
            <p className="text-muted-foreground">
              Interface de gestion des paiements à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}