import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";

export default function Careers() {
  return (
    <ServicesModuleLayout title="Insertion professionnelle" subtitle="Stage, emploi et carrière">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Insertion Professionnelle</h2>
            <p className="text-muted-foreground">
              Interface de gestion des services d'insertion professionnelle, stages et emploi.
            </p>
          </div>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}