import { ServicesPageHeader } from "@/components/ServicesPageHeader";

export default function Activities() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesPageHeader 
        title="Activités extra-scolaires" 
        subtitle="Sports, clubs et associations" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Activités Extra-scolaires</h2>
            <p className="text-muted-foreground">
              Interface de gestion des activités extra-scolaires à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}