import { DashboardHeader } from "@/components/DashboardHeader";
import { ModuleCard } from "@/components/ModuleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock,
  Target,
  BookOpen,
  CreditCard,
  UserCheck,
  Settings,
  HeartHandshake,
  Stethoscope,
  Building
} from "lucide-react";

export default function Dashboard() {
  const mainStats = [
    { 
      title: "Modules Actifs", 
      value: "12/12", 
      description: "Tous les modules fonctionnels",
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      title: "Système", 
      value: "99.8%", 
      description: "Disponibilité plateforme",
      icon: Settings,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      title: "Année Académique", 
      value: "2024-25", 
      description: "Semestre 1 en cours",
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  const modules = [
    {
      title: "Gestion Étudiants",
      description: "Inscriptions automatisées",
      icon: Users,
      color: "students",
      notifications: 12,
      route: "/students"
    },
    {
      title: "Programmes Académiques",
      description: "Cursus et formations",
      icon: GraduationCap,
      color: "academic",
      notifications: 3,
      route: "/academic"
    },
    {
      title: "Examens & Organisation",
      description: "Planning IA optimisé",
      icon: FileText,
      color: "exams",
      notifications: 8,
      route: "/exams"
    },
    {
      title: "Évaluations & Résultats",
      description: "Notes et bulletins",
      icon: BarChart3,
      color: "results",
      notifications: 5,
      route: "/results"
    },
    {
      title: "Finance & Comptabilité",
      description: "Facturation automatique",
      icon: CreditCard,
      color: "finance",
      notifications: 2,
      route: "/finance"
    },
    {
      title: "E-Learning",
      description: "Plateforme numérique",
      icon: BookOpen,
      color: "elearning",
      notifications: 0,
      route: "/elearning"
    },
    {
      title: "Ressources Humaines",
      description: "Gestion du personnel",
      icon: UserCheck,
      color: "hr",
      notifications: 4,
      route: "/hr"
    },
    {
      title: "Ressources & Équipements",
      description: "Matériel et infrastructures",
      icon: Building,
      color: "resources",
      notifications: 1,
      route: "/resources"
    },
    {
      title: "Partenariats & Relations",
      description: "Entreprises et institutions",
      icon: HeartHandshake,
      color: "partnerships",
      notifications: 0,
      route: "/partnerships"
    },
    {
      title: "Santé & Services",
      description: "Bien-être étudiant",
      icon: Stethoscope,
      color: "health",
      notifications: 3,
      route: "/health"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Tableau de Bord" 
        subtitle="Vue d'ensemble de votre établissement"
      />
      
      <main className="p-6 space-y-8">
        {/* Main Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Module Grid */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6">Modules Academic+</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-card/80 backdrop-blur border-border/50"
                >
                  <CardContent className="p-6 text-center relative">
                    {module.notifications > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 min-w-0 h-6">
                        {module.notifications}
                      </Badge>
                    )}
                    <div 
                      className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: `rgb(var(--${module.color}))` }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-2">
                      {module.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {module.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-academic" />
                Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-students rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">47 nouvelles inscriptions</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-exams rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Examen de Mathématiques planifié</p>
                  <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-results rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">89 bulletins générés</p>
                  <p className="text-xs text-muted-foreground">Il y a 6 heures</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-academic" />
                Performance Globale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Inscriptions ce mois</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-[85%] h-full bg-students rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de réussite</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-[89%] h-full bg-results rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">89%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Satisfaction</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-[94%] h-full bg-academic rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}