import { DashboardHeader } from "@/components/DashboardHeader";
import { ModuleCard } from "@/components/ModuleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Users, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock,
  Target
} from "lucide-react";

export default function Dashboard() {
  const quickStats = [
    { label: "Étudiants Actifs", value: "2,847", icon: Users, trend: "+12%" },
    { label: "Cours en Cours", value: "156", icon: GraduationCap, trend: "+5%" },
    { label: "Examens ce Mois", value: "23", icon: FileText, trend: "+8%" },
    { label: "Taux de Réussite", value: "89%", icon: Target, trend: "+3%" },
  ];

  const moduleStats = [
    {
      title: "Gestion Étudiants",
      description: "Inscriptions et profils",
      icon: Users,
      color: "students",
      stats: [
        { label: "Nouvelles inscriptions", value: "47" },
        { label: "En attente", value: "12" }
      ]
    },
    {
      title: "Examens & Organisation",
      description: "Planification examens",
      icon: FileText,
      color: "exams",
      stats: [
        { label: "Examens planifiés", value: "23" },
        { label: "Salles réservées", value: "15" }
      ]
    },
    {
      title: "Évaluations & Résultats",
      description: "Notes et bulletins",
      icon: BarChart3,
      color: "results",
      stats: [
        { label: "Notes saisies", value: "1,247" },
        { label: "Bulletins générés", value: "89" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Tableau de Bord" 
        subtitle="Vue d'ensemble de votre établissement"
      />
      
      <main className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-academic/10 to-students/10 rounded-lg p-6 border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Bienvenue sur Academic+ 🎓
          </h2>
          <p className="text-muted-foreground">
            Plateforme de gestion éducative complète pour votre établissement. 
            Gérez vos 12 modules en un seul endroit.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-students">{stat.trend}</p>
                    </div>
                    <div className="w-10 h-10 bg-academic/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-academic" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Module Overview */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Modules Prioritaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleStats.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                color={module.color}
                stats={module.stats}
                actions={[
                  { label: "Voir détails", onClick: () => {}, variant: "outline" },
                  { label: "Gérer", onClick: () => {} }
                ]}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-academic" />
                Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-students rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">47 nouvelles inscriptions</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-exams rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Examen de Mathématiques planifié</p>
                  <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-results rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">89 bulletins générés</p>
                  <p className="text-xs text-muted-foreground">Il y a 6 heures</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-academic" />
                Événements Prochains
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                <div className="w-8 h-8 bg-exams text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                  15
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Examens de fin de semestre</p>
                  <p className="text-xs text-muted-foreground">Dans 3 jours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                <div className="w-8 h-8 bg-students text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                  20
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Conseils de classe</p>
                  <p className="text-xs text-muted-foreground">Dans 1 semaine</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                <div className="w-8 h-8 bg-finance text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                  25
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Échéance paiements</p>
                  <p className="text-xs text-muted-foreground">Dans 10 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}