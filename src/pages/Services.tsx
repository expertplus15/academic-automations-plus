import { ServicesPageHeader } from "@/components/ServicesPageHeader";

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesPageHeader 
        title="Services aux Étudiants" 
        subtitle="Transport, restauration et hébergement" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Services Étudiants</h2>
            <p className="text-muted-foreground">
              Vue d'ensemble des services proposés aux étudiants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}