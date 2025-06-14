import { HrPageHeader } from "@/components/HrPageHeader";

export default function Sync() {
  return (
    <div className="min-h-screen bg-background">
      <HrPageHeader 
        title="Synchronisation" 
        subtitle="RH ↔ Académique ↔ Finance" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Synchronisation</h2>
            <p className="text-muted-foreground">
              Interface de synchronisation entre modules RH, Académique et Finance à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}