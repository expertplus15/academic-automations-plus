import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Users, 
  FileText, 
  BarChart3, 
  Calendar,
  Target,
  BookOpen,
  CreditCard,
  UserCheck,
  Settings,
  HeartHandshake,
  Stethoscope,
  Building,
  Coffee
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const mainStats = [
    { 
      title: "Modules Actifs", 
      value: "11", 
      description: "",
      icon: GraduationCap,
      color: "text-white",
      bgColor: "bg-blue-500"
    },
    { 
      title: "Système", 
      value: "Actif", 
      description: "",
      icon: Users,
      color: "text-white",
      bgColor: "bg-green-500"
    },
    { 
      title: "Année Académique", 
      value: "2024-25", 
      description: "",
      icon: Calendar,
      color: "text-white",
      bgColor: "bg-purple-500"
    }
  ];

  const modules = [
    {
      title: "Académique",
      icon: GraduationCap,
      color: "academic",
      notifications: 5,
      route: "/academic"
    },
    {
      title: "Gestion Étudiants",
      icon: Users,
      color: "students",
      notifications: "9+",
      route: "/students"
    },
    {
      title: "Examens",
      icon: FileText,
      color: "exams",
      notifications: 2,
      route: "/exams"
    },
    {
      title: "Évaluations et Résultats",
      icon: BarChart3,
      color: "results",
      notifications: 3,
      route: "/results"
    },
    {
      title: "Finance",
      icon: CreditCard,
      color: "finance",
      notifications: 3,
      route: "/finance"
    },
    {
      title: "Ressources Humaines",
      icon: UserCheck,
      color: "hr",
      notifications: 1,
      route: "/hr"
    },
    {
      title: "Communication",
      icon: Building,
      color: "partnerships",
      notifications: 8,
      route: "/communication"
    },
    {
      title: "E-Learning",
      icon: BookOpen,
      color: "elearning",
      notifications: 0,
      route: "/elearning"
    },
    {
      title: "Ressources",
      icon: Settings,
      color: "resources",
      notifications: 4,
      route: "/resources"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-8 space-y-8">
        {/* Welcome Message */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                Bon après-midi, Administrateur
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              Bienvenue sur votre tableau de bord de gestion académique. Gérez efficacement vos modules et suivez l'activité de votre établissement.
            </p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3">
            Accès Rapide
          </Button>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`${stat.bgColor} border-0 text-white`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Module Grid */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">Modules de gestion</h3>
            <p className="text-muted-foreground">Accédez aux outils de gestion de votre établissement</p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.route}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-card border-border/20 hover:border-border/40">
                    <CardContent className="p-8 text-center relative">
                      {(typeof module.notifications === 'number' ? module.notifications > 0 : module.notifications !== "0") && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 min-w-0 h-6 border-0">
                          {module.notifications}
                        </Badge>
                      )}
                      <div 
                        className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: `rgb(var(--${module.color}))` }}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h4 className="font-medium text-foreground text-sm">
                        {module.title}
                      </h4>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
