import { ServicesPageHeader } from "@/components/ServicesPageHeader";

export default function Library() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesPageHeader 
        title="Bibliothèque numérique" 
        subtitle="Ressources documentaires" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Bibliothèque Numérique</h2>
            <p className="text-muted-foreground">
              Interface de gestion de la bibliothèque numérique à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}