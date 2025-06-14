import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";

export default function Property() {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesPageHeader 
        title="Patrimoine immobilier" 
        subtitle="Suivi et valorisation" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Patrimoine Immobilier</h2>
            <p className="text-muted-foreground">
              Interface de suivi et valorisation du patrimoine immobilier à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}