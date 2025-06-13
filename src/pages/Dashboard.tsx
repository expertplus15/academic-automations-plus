import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      title: "Modules", 
      value: "11", 
      description: "Modules actifs",
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    { 
      title: "Système", 
      value: "Actif", 
      description: "Plateforme opérationnelle",
      icon: Settings,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    { 
      title: "Utilisateurs", 
      value: "1,247", 
      description: "Connectés aujourd'hui",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
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
      title: "Services aux Étudiants",
      description: "Transport, restauration",
      icon: Coffee,
      color: "services",
      notifications: 0,
      route: "/services"
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader />
      
      <main className="p-8 space-y-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              {getGreeting()}, Dr. Martin
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Voici un aperçu de votre plateforme de gestion éducative
          </p>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-slate-900/50 backdrop-blur border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Module Grid */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Modules Academic+</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.route}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700">
                    <CardContent className="p-6 text-center relative">
                      {module.notifications > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 min-w-0 h-6 border-0">
                          {module.notifications}
                        </Badge>
                      )}
                      <div 
                        className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: `rgb(var(--${module.color}))` }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-sm text-white mb-1 line-clamp-2 leading-tight">
                        {module.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {module.description}
                      </p>
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