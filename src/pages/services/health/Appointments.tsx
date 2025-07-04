import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";

export default function ServicesHealthAppointments() {
  return (
    <ServicesModuleLayout title="Rendez-vous Médicaux" subtitle="Planification et suivi des rendez-vous de santé">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Rendez-vous Médicaux</h2>
            <p className="text-muted-foreground">
              Interface de gestion des rendez-vous médicaux.
            </p>
          </div>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}