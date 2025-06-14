import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";

export default function Procurement() {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesPageHeader 
        title="Achats & approvisionnements" 
        subtitle="Gestion des commandes" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Achats & Approvisionnements</h2>
            <p className="text-muted-foreground">
              Interface de gestion des achats et approvisionnements à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}