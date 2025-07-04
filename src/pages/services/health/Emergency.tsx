import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";

export default function ServicesHealthEmergency() {
  return (
    <ServicesModuleLayout title="Services d'Urgence" subtitle="Protocoles et gestion des urgences médicales">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Services d'Urgence</h2>
            <p className="text-muted-foreground">
              Interface de gestion des urgences médicales et protocoles.
            </p>
          </div>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}