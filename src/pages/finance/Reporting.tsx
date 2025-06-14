import { FinancePageHeader } from "@/components/FinancePageHeader";

export default function Reporting() {
  return (
    <div className="min-h-screen bg-background">
      <FinancePageHeader 
        title="Reporting financier" 
        subtitle="Analytics et rapports financiers" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Reporting Financier</h2>
            <p className="text-muted-foreground">
              Interface d'analytics et reporting financier à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}