import { ResultsPageHeader } from "@/components/ResultsPageHeader";

export default function Transcripts() {
  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Relevés standards" 
        subtitle="Standards académiques officiels" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Relevés Standards</h2>
            <p className="text-muted-foreground">
              Interface de génération des relevés standards académiques à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}