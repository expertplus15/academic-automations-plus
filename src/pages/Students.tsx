
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ModuleCard } from "@/components/ModuleCard";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Download,
  Users
} from "lucide-react";
import { StudentsRealTimeDashboard } from "@/components/students/StudentsRealTimeDashboard";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const navigate = useNavigate();

  return (
    <ModuleLayout 
      title="Gestion des Étudiants" 
      subtitle="Tableau de bord principal du module étudiants"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        {/* Feature Highlight */}
        <div className="bg-gradient-to-r from-students/10 to-students/5 rounded-lg p-6 border border-students/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-students rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Inscription Automatisée &lt; 30 secondes</h2>
              <p className="text-muted-foreground">Fonctionnalité signature d'Academic+</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Notre processus d'inscription révolutionnaire permet aux étudiants de s'inscrire 
            automatiquement avec validation temps réel, génération de numéro étudiant et 
            déclenchement de la facturation en moins de 30 secondes.
          </p>
          <Button 
            className="bg-students hover:bg-students/90"
            onClick={() => navigate('/students/registration')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvelle Inscription
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleCard
            title="Inscription Express"
            description="Processus automatisé < 30s"
            icon={UserPlus}
            color="students"
            actions={[
              { label: "Démarrer", onClick: () => navigate('/students/registration') }
            ]}
          />
          <ModuleCard
            title="Import en Masse"
            description="Importer depuis Excel/CSV"
            icon={Download}
            color="students"
            actions={[
              { label: "Importer", onClick: () => {}, variant: "outline" }
            ]}
          />
          <ModuleCard
            title="Profils Étudiants"
            description="Gérer les informations"
            icon={Users}
            color="students"
            actions={[
              { label: "Consulter", onClick: () => navigate('/students/profiles'), variant: "outline" }
            ]}
          />
        </div>

        {/* Real-Time Dashboard with Live Data */}
        <StudentsRealTimeDashboard />
      </div>
    </ModuleLayout>
  );
}
