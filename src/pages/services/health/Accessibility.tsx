import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";

export default function ServicesHealthAccessibility() {
  return (
    <ServicesModuleLayout title="Accessibilité" subtitle="Support et accompagnement handicap">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Services d'Accessibilité</h2>
            <p className="text-muted-foreground">
              Interface de gestion des services d'accessibilité et support handicap.
            </p>
          </div>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}