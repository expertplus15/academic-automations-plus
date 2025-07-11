import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";

export default function Tracking() {
  return (
    <StudentsModuleLayout 
      title="Suivi Académique" 
      subtitle="Suivi des performances et du parcours des étudiants"
    >
      <div className="p-6">
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-semibold mb-2">Module Suivi Académique</h3>
          <p>Fonctionnalité en cours de développement</p>
        </div>
      </div>
    </StudentsModuleLayout>
  );
}