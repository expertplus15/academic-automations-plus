import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";

export default function Documents() {
  return (
    <StudentsModuleLayout 
      title="Documents Administratifs" 
      subtitle="Génération et gestion des documents étudiants"
    >
      <div className="p-6">
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-semibold mb-2">Module Documents Administratifs</h3>
          <p>Fonctionnalité en cours de développement</p>
        </div>
      </div>
    </StudentsModuleLayout>
  );
}