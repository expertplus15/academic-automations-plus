import { ElearningPageHeader } from "@/components/ElearningPageHeader";

export default function Streaming() {
  return (
    <div className="min-h-screen bg-background">
      <ElearningPageHeader 
        title="Streaming vidéo" 
        subtitle="Streaming adaptatif" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Streaming Vidéo</h2>
            <p className="text-muted-foreground">
              Interface de streaming vidéo adaptatif à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}