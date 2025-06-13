import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  BookOpen, 
  Users,
  Building,
  Calendar,
  RefreshCw,
  Settings,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Academic() {
  const statusCards = [
    { 
      label: "Système", 
      value: "Actif", 
      icon: RefreshCw, 
      color: "text-green-400",
      bg: "bg-green-400/10"
    },
    { 
      label: "Modules", 
      value: "2", 
      icon: Building, 
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    { 
      label: "Configuration", 
      value: "Prêt", 
      icon: Settings, 
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    },
    { 
      label: "Année", 
      value: "2024-25", 
      icon: Calendar, 
      color: "text-orange-400",
      bg: "bg-orange-400/10"
    }
  ];

  const academicModules = [
    {
      title: "Programmes",
      description: "12 programmes",
      icon: GraduationCap,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      link: "/academic/programs"
    },
    {
      title: "Filières",
      description: "8 filières",
      icon: BookOpen,
      color: "text-green-400",
      bg: "bg-green-400/10",
      link: "/academic/pathways"
    },
    {
      title: "Niveaux d'Études",
      description: "6 niveaux",
      icon: Users,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      link: "/academic/levels"
    },
    {
      title: "Classes",
      description: "24 classes",
      icon: Building,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      badge: "Nouveau",
      link: "/academic/groups"
    },
    {
      title: "Cours",
      description: "Gestion des cours",
      icon: BookOpen,
      color: "text-green-400",
      bg: "bg-green-400/10",
      link: "/academic/subjects"
    },
    {
      title: "Infrastructures",
      description: "Salles et équipements",
      icon: Building,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      link: "/academic/infrastructure"
    },
    {
      title: "Emploi du Temps",
      description: "Planning intelligent",
      icon: Calendar,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      badge: "Actif",
      link: "/academic/timetables"
    },
    {
      title: "Évaluations",
      description: "Notes et bulletins",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      link: "/academic/evaluations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                2023-2024
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-border/50">
        <div className="p-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestion Académique</h1>
            <p className="text-muted-foreground text-lg">
              Gérez programmes, filières, emplois du temps et infrastructures depuis une interface unique. 
              Optimisez l'organisation pédagogique avec des outils intelligents.
            </p>
          </div>
        </div>
      </div>

      <main className="p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="text-lg font-semibold text-foreground">{card.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Academic Modules Grid */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Modules Académiques</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {academicModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.link}>
                  <Card className="border border-border/50 hover:border-border transition-colors cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 ${module.bg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-6 h-6 ${module.color}`} />
                          </div>
                          {module.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {module.badge}
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
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