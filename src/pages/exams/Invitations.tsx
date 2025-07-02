import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";

export default function Invitations() {
  return (
    <ExamsModuleLayout 
      title="Convocations massives" 
      subtitle="Génération automatique des convocations"
    >
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Convocations Massives</h2>
            <p className="text-muted-foreground">
              Interface de génération des convocations massives à venir.
            </p>
          </div>
        </div>
      </div>
    </ExamsModuleLayout>
  );
}