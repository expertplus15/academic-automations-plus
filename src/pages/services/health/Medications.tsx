import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";

export default function ServicesHealthMedications() {
  return (
    <ServicesModuleLayout title="Médicaments" subtitle="Gestion des traitements et médicaments">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des Médicaments</h2>
            <p className="text-muted-foreground">
              Interface de gestion des traitements médicamenteux.
            </p>
          </div>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}