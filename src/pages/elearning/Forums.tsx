import { ElearningPageHeader } from "@/components/ElearningPageHeader";

export default function Forums() {
  return (
    <div className="min-h-screen bg-background">
      <ElearningPageHeader 
        title="Forums discussion" 
        subtitle="Collaboration et échanges" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Forums de Discussion</h2>
            <p className="text-muted-foreground">
              Interface de forums de discussion collaborative à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}