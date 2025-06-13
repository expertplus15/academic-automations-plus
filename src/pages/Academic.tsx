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
  ChevronDown,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Academic() {
  const statusCards = [
    { 
      label: "Système", 
      value: "Actif", 
      description: "Statut général",
      icon: RefreshCw, 
      color: "text-[#4f7cff]",
      bg: "bg-[#4f7cff]/10"
    },
    { 
      label: "Modules", 
      value: "2", 
      description: "Disponibles",
      icon: Building, 
      color: "text-[#10b981]",
      bg: "bg-[#10b981]/10"
    },
    { 
      label: "Configuration", 
      value: "Prêt", 
      description: "Niveaux",
      icon: Settings, 
      color: "text-[#f59e0b]",
      bg: "bg-[#f59e0b]/10"
    },
    { 
      label: "Année", 
      value: "2024-25", 
      description: "Académique",
      icon: Calendar, 
      color: "text-[#8b5cf6]",
      bg: "bg-[#8b5cf6]/10"
    }
  ];

  const academicModulesRow1 = [
    {
      title: "Programmes",
      description: "Gestion des programmes d'études",
      detail: "12 programmes",
      icon: GraduationCap,
      color: "text-[#4f7cff]",
      bg: "bg-[#4f7cff]/10",
      link: "/academic/programs"
    },
    {
      title: "Filières",
      description: "Organisation des filières",
      detail: "8 filières",
      icon: BookOpen,
      color: "text-[#06b6d4]",
      bg: "bg-[#06b6d4]/10",
      link: "/academic/pathways"
    },
    {
      title: "Niveaux d'Études",
      description: "Structure des niveaux",
      detail: "6 niveaux",
      icon: Users,
      color: "text-[#f59e0b]",
      bg: "bg-[#f59e0b]/10",
      link: "/academic/levels"
    },
    {
      title: "Classes",
      description: "Gestion des groupes d'étudiants",
      detail: "24 classes",
      icon: Building,
      color: "text-[#8b5cf6]",
      bg: "bg-[#8b5cf6]/10",
      badge: "Nouveau",
      link: "/academic/groups"
    }
  ];

  const academicModulesRow2 = [
    {
      title: "Cours",
      description: "Gestion des matières enseignées",
      detail: "Planification",
      icon: BookOpen,
      color: "text-[#10b981]",
      bg: "bg-[#10b981]/10",
      link: "/academic/subjects"
    },
    {
      title: "Infrastructures",
      description: "Salles et équipements",
      detail: "Disponibilités",
      icon: Building,
      color: "text-[#f59e0b]",
      bg: "bg-[#f59e0b]/10",
      link: "/academic/infrastructure"
    },
    {
      title: "Emploi du Temps",
      description: "Planning intelligent et automatisé",
      detail: "Optimisé",
      icon: Calendar,
      color: "text-[#4f7cff]",
      bg: "bg-[#4f7cff]/10",
      badge: "Actif",
      link: "/academic/timetables"
    },
    {
      title: "Évaluations",
      description: "Notes et bulletins de performance",
      detail: "Contrôles",
      icon: Users,
      color: "text-[#8b5cf6]",
      bg: "bg-[#8b5cf6]/10",
      link: "/academic/evaluations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2 border-border/50">
                2023-2024
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border/50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm" className="border-border/50">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4f7cff]/90 to-[#8b5cf6]/90 border-b border-border/30">
        <div className="p-6">
          <div className="max-w-4xl flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Gestion Académique</h1>
              <p className="text-white/90 text-lg">
                Gérez programmes, filières, emplois du temps et infrastructures depuis une interface unique. 
                Optimisez l'organisation pédagogique avec des outils intelligents.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="p-6 space-y-8">
        {/* Status Cards */}
        <div className="grid grid-cols-4 gap-6">
          {statusCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="border border-border/30 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${card.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{card.label}</p>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <p className="text-2xl font-bold text-foreground mb-1">{card.value}</p>
                      <p className="text-xs text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Academic Modules Grid - Row 1 */}
        <div>
          <div className="grid grid-cols-4 gap-6 mb-6">
            {academicModulesRow1.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.link}>
                  <Card className="border border-border/30 hover:border-border transition-colors cursor-pointer group shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 ${module.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-6 h-6 ${module.color}`} />
                          </div>
                          {module.badge && (
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {module.badge}
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-2 text-lg">{module.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-foreground">{module.detail}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Academic Modules Grid - Row 2 */}
          <div className="grid grid-cols-4 gap-6">
            {academicModulesRow2.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.link}>
                  <Card className="border border-border/30 hover:border-border transition-colors cursor-pointer group shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 ${module.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-6 h-6 ${module.color}`} />
                          </div>
                          {module.badge && (
                            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                              {module.badge}
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-2 text-lg">{module.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-foreground">{module.detail}</p>
                          </div>
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

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full w-14 h-14 bg-[#4f7cff] hover:bg-[#4f7cff]/90 shadow-2xl">
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}