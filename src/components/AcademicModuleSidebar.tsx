import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Settings,
  Building,
  ArrowLeft,
} from "lucide-react";

const academicSubModules = [
  {
    title: "Programmes d'études",
    url: "/academic/programs",
    icon: GraduationCap,
    description: "Cursus, diplômes, certifications"
  },
  {
    title: "Filières & Parcours",
    url: "/academic/pathways",
    icon: BookOpen,
    description: "Spécialisations, options, prérequis"
  },
  {
    title: "Matières & Coefficients",
    url: "/academic/subjects",
    icon: Settings,
    description: "UE, crédits ECTS, pondérations"
  },
  {
    title: "Niveaux d'études",
    url: "/academic/levels",
    icon: Users,
    description: "DUT 1-2, L1-L3, M1-M2, doctorat"
  },
  {
    title: "Emplois du temps",
    url: "/academic/timetables",
    icon: Clock,
    description: "Planning intelligent anti-conflits"
  },
  {
    title: "Calendrier académique",
    url: "/academic/calendar",
    icon: Calendar,
    description: "Semestres, vacances, examens"
  },
  {
    title: "Classes & Groupes",
    url: "/academic/groups",
    icon: Users,
    description: "Effectifs, répartitions automatiques"
  },
];

export function AcademicModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-academic rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Académique</h1>
            <p className="text-xs text-muted-foreground">& Pédagogie</p>
          </div>
        </div>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Fonctionnalités</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {academicSubModules.map((subModule) => {
                const Icon = subModule.icon;
                const isActive = location.pathname === subModule.url;
                
                return (
                  <SidebarMenuItem key={subModule.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={subModule.url}
                        className={cn(
                          "group flex items-start gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]",
                          isActive && "bg-sidebar-accent"
                        )}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-110"
                          style={{ backgroundColor: "rgb(var(--academic))" }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-sidebar-foreground truncate">
                            {subModule.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {subModule.description}
                          </p>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="text-xs text-muted-foreground">
          <p>Academic+ v1.0</p>
          <p>© 2025 MyAcademics</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}