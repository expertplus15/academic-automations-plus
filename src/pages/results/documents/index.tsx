import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Layout, ArrowRight, BarChart3, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DocumentsMain() {
  const navigate = useNavigate();

  const modules = [
    {
      id: "creation",
      title: "Création de Documents et Templates",
      description: "Créer et gérer les templates de documents (bulletins, relevés, attestations)",
      icon: Layout,
      color: "bg-blue-500",
      features: [
        "Éditeur de templates avancé",
        "Gestion des variables dynamiques",
        "Prévisualisation en temps réel",
        "Templates prédéfinis",
        "Versioning des templates"
      ],
      path: "/results/documents/creation"
    },
    {
      id: "generation",
      title: "Génération de Documents",
      description: "Générer des documents individuels ou en masse pour les étudiants",
      icon: FileText,
      color: "bg-green-500",
      features: [
        "Génération individuelle",
        "Génération en masse",
        "Suivi des traitements",
        "Historique des générations",
        "Export multi-formats"
      ],
      path: "/results/documents/generation"
    }
  ];

  const stats = [
    { label: "Templates actifs", value: "12", icon: Layout },
    { label: "Documents générés ce mois", value: "1,847", icon: FileText },
    { label: "Étudiants traités", value: "523", icon: Users },
    { label: "Temps moyen de génération", value: "2.3s", icon: BarChart3 }
  ];

  return (
    <ModuleLayout 
      title="Documents & Templates" 
      subtitle="Création de templates et génération de documents académiques"
      showHeader={true}
    >
      <div className="p-6 space-y-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Module Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {modules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${module.color} text-white`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {module.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Features List */}
                <div>
                  <h4 className="font-medium mb-3">Fonctionnalités principales :</h4>
                  <ul className="space-y-2">
                    {module.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => navigate(module.path)}
                  className="w-full"
                  size="lg"
                >
                  Accéder au module
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => navigate("/results/documents/creation")}>
                <Layout className="h-4 w-4 mr-2" />
                Créer un template
              </Button>
              <Button variant="outline" onClick={() => navigate("/results/documents/generation")}>
                <FileText className="h-4 w-4 mr-2" />
                Générer des documents
              </Button>
              <Button variant="outline" onClick={() => navigate("/results/analytics")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Voir les statistiques
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}