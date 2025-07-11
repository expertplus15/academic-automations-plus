import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";

export default function Alerts() {
  return (
    <StudentsModuleLayout 
      title="Alertes Automatiques" 
      subtitle="Configuration et gestion des alertes étudiants"
    >
      <div className="p-6">
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-semibold mb-2">Module Alertes Automatiques</h3>
          <p>Fonctionnalité en cours de développement</p>
        </div>
      </div>
    </StudentsModuleLayout>
  );
}