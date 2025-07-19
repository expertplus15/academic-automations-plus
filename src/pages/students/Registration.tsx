
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  FileText,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Registration() {
  const stats = {
    totalApplications: 45,
    pending: 12,
    approved: 28,
    rejected: 5
  };

  const quickActions = [
    {
      title: "Nouvelle inscription",
      description: "Démarrer le processus d'inscription",
      icon: UserPlus,
      path: "/students/new",
      color: "text-primary"
    },
    {
      title: "Tableau de bord",
      description: "Voir le suivi en temps réel",
      icon: Clock,
      path: "/students/registration/dashboard",
      color: "text-info"
    },
    {
      title: "Approbations",
      description: "Gérer les demandes en attente",
      icon: CheckCircle,
      path: "/students/registration/approval",
      color: "text-success"
    }
  ];

  return (
    <StudentsModuleLayout 
      title="Inscription Automatisée" 
      subtitle="Système d'inscription intelligent avec validation en temps réel"
    >
      <div className="p-6 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Demandes</p>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approuvées</p>
                  <p className="text-2xl font-bold text-success">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejetées</p>
                  <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <action.icon className={`h-8 w-8 ${action.color}`} />
                        <div className="flex-1">
                          <h3 className="font-medium">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Processus d'inscription */}
        <Card>
          <CardHeader>
            <CardTitle>Processus d'Inscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 py-3 border-b">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Soumission du dossier</p>
                  <p className="text-sm text-muted-foreground">L'étudiant soumet sa demande avec les pièces justificatives</p>
                </div>
                <Badge variant="secondary">Automatique</Badge>
              </div>
              
              <div className="flex items-center space-x-3 py-3 border-b">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Validation automatique</p>
                  <p className="text-sm text-muted-foreground">Vérification des critères d'éligibilité et des documents</p>
                </div>
                <Badge variant="outline">IA + Manuel</Badge>
              </div>
              
              <div className="flex items-center space-x-3 py-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Finalisation</p>
                  <p className="text-sm text-muted-foreground">Création du profil étudiant et génération de la carte</p>
                </div>
                <Badge variant="secondary">Automatique</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}
