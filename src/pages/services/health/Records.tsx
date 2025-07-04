import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";

export default function ServicesHealthRecords() {
  return (
    <ServicesModuleLayout title="Dossiers Médicaux" subtitle="Gestion des dossiers de santé des étudiants">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Dossiers Médicaux</h2>
            <p className="text-muted-foreground">
              Interface de gestion des dossiers médicaux des étudiants.
            </p>
          </div>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}