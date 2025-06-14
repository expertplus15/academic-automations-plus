import { FinancePageHeader } from "@/components/FinancePageHeader";

export default function Finance() {
  return (
    <div className="min-h-screen bg-background">
      <FinancePageHeader 
        title="Gestion Finance" 
        subtitle="Facturation, paiements et comptabilité" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Tableau de Bord Finance</h2>
            <p className="text-muted-foreground">
              Vue d'ensemble des finances de l'établissement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}