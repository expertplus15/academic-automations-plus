import { ResultsPageHeader } from "@/components/ResultsPageHeader";

export default function Matrix() {
  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Interface matricielle" 
        subtitle="Saisie collaborative des notes" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Interface Matricielle</h2>
            <p className="text-muted-foreground">
              Interface de saisie collaborative des notes en mode matriciel à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}