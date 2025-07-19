import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  BookOpen,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentsPage() {
  // Mock data
  const stats = {
    totalStudents: 156,
    activeStudents: 142,
    newThisMonth: 8,
    pendingDocuments: 12
  };

  const quickActions = [
    {
      title: "Nouveau étudiant",
      description: "Inscrire un nouvel étudiant",
      icon: UserPlus,
      path: "/students/new",
      color: "text-primary"
    },
    {
      title: "Consulter les alertes",
      description: "Voir les alertes importantes",
      icon: AlertTriangle,
      path: "/students/alerts",
      color: "text-warning"
    },
    {
      title: "Gestion des groupes",
      description: "Organiser les classes",
      icon: Users,
      path: "/students/groups",
      color: "text-success"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestion des Étudiants</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des étudiants et fonctionnalités principales
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Étudiants</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Étudiants Actifs</p>
                <p className="text-2xl font-bold text-success">{stats.activeStudents}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nouveaux ce mois</p>
                <p className="text-2xl font-bold text-info">{stats.newThisMonth}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents en attente</p>
                <p className="text-2xl font-bold text-warning">{stats.pendingDocuments}</p>
              </div>
              <BookOpen className="h-8 w-8 text-warning" />
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
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activités récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Activités Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 py-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau étudiant inscrit</p>
                <p className="text-xs text-muted-foreground">Marie Dupont - DUT GE - Il y a 2 heures</p>
              </div>
              <Badge variant="secondary">Nouveau</Badge>
            </div>
            
            <div className="flex items-center space-x-3 py-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Documents manquants</p>
                <p className="text-xs text-muted-foreground">3 étudiants ont des documents en attente</p>
              </div>
              <Badge variant="outline">Action requise</Badge>
            </div>
            
            <div className="flex items-center space-x-3 py-2">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mise à jour des groupes</p>
                <p className="text-xs text-muted-foreground">Groupe DUT2-GE mis à jour - Il y a 1 jour</p>
              </div>
              <Badge variant="secondary">Terminé</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}