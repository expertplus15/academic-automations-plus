import { ServicesPageHeader } from "@/components/ServicesPageHeader";

export default function Accommodation() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesPageHeader 
        title="Hébergement" 
        subtitle="Internat et dortoirs" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Hébergement</h2>
            <p className="text-muted-foreground">
              Interface de gestion de l'hébergement et des dortoirs à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}