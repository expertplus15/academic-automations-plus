import { ServicesPageHeader } from "@/components/ServicesPageHeader";

export default function Catering() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesPageHeader 
        title="Restauration" 
        subtitle="Menus & paiements" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Restauration</h2>
            <p className="text-muted-foreground">
              Interface de gestion de la restauration et paiements à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}