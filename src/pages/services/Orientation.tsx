import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";

export default function Orientation() {
  return (
    <ServicesModuleLayout title="Orientation scolaire" subtitle="Accompagnement et conseils d'orientation">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Services d'Orientation</h2>
            <p className="text-muted-foreground">
              Interface de gestion des services d'orientation scolaire et professionnelle.
            </p>
          </div>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}