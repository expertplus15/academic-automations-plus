import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesPageHeader 
        title="Maintenance préventive" 
        subtitle="Maintenance automatisée" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Maintenance Préventive</h2>
            <p className="text-muted-foreground">
              Interface de maintenance préventive automatisée à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}