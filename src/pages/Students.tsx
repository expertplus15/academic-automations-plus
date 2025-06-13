import { DashboardHeader } from "@/components/DashboardHeader";
import { ModuleCard } from "@/components/ModuleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";
import { useState } from "react";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");

  const enrollmentStats = [
    { label: "Total Étudiants", value: "2,847" },
    { label: "Nouveaux (ce mois)", value: "127" },
    { label: "En cours d'inscription", value: "23" },
    { label: "Taux de rétention", value: "94%" }
  ];

  const recentEnrollments = [
    {
      id: "ETU001",
      name: "Marie Dubois",
      program: "Master Informatique",
      status: "completed",
      enrollmentTime: "23 secondes",
      date: "Aujourd'hui 14:30"
    },
    {
      id: "ETU002", 
      name: "Jean Martin",
      program: "Licence Marketing",
      status: "pending",
      enrollmentTime: "En cours...",
      date: "Aujourd'hui 14:15"
    },
    {
      id: "ETU003",
      name: "Sophie Chen",
      program: "DUT Génie Civil",
      status: "completed",
      enrollmentTime: "18 secondes",
      date: "Aujourd'hui 13:45"
    },
    {
      id: "ETU004",
      name: "Pierre Moreau",
      program: "Master Business",
      status: "documents_required",
      enrollmentTime: "Suspendu",
      date: "Aujourd'hui 13:20"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-students/10 text-students border-students/20">Terminé</Badge>;
      case "pending":
        return <Badge variant="secondary">En cours</Badge>;
      case "documents_required":
        return <Badge variant="destructive">Documents requis</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-students" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "documents_required":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Gestion Étudiants" 
        subtitle="Inscriptions automatisées et gestion des profils"
      />
      
      <main className="p-6 space-y-6">
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
          <Button className="bg-students hover:bg-students/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvelle Inscription
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enrollmentStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleCard
            title="Inscription Express"
            description="Processus automatisé < 30s"
            icon={UserPlus}
            color="students"
            actions={[
              { label: "Démarrer", onClick: () => {} }
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
              { label: "Consulter", onClick: () => {}, variant: "outline" }
            ]}
          />
        </div>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-students" />
                  Inscriptions Récentes
                </CardTitle>
                <CardDescription>
                  Suivi temps réel des nouvelles inscriptions
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher étudiant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(enrollment.status)}
                    <div>
                      <p className="font-medium text-foreground">{enrollment.name}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{enrollment.program}</p>
                    <p className="text-xs text-muted-foreground">{enrollment.date}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-students">{enrollment.enrollmentTime}</p>
                    <p className="text-xs text-muted-foreground">Temps d'inscription</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(enrollment.status)}
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance d'Inscription</CardTitle>
              <CardDescription>Temps moyen d'inscription par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Janvier 2025</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full">
                      <div className="w-[85%] h-full bg-students rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">25.4s</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Décembre 2024</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full">
                      <div className="w-[90%] h-full bg-students rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">27.1s</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Novembre 2024</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full">
                      <div className="w-[95%] h-full bg-students rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">28.7s</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-students/5 rounded-lg">
                <p className="text-sm text-students font-medium">🎯 Objectif: &lt; 30 secondes</p>
                <p className="text-xs text-muted-foreground">Performance actuelle: 25.4s (Excellent!)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition par Programme</CardTitle>
              <CardDescription>Distribution des étudiants actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Master Informatique</span>
                  <span className="text-sm font-medium">847 étudiants</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Licence Marketing</span>
                  <span className="text-sm font-medium">623 étudiants</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DUT Génie Civil</span>
                  <span className="text-sm font-medium">456 étudiants</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Master Business</span>
                  <span className="text-sm font-medium">321 étudiants</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Autres programmes</span>
                  <span className="text-sm font-medium">600 étudiants</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}