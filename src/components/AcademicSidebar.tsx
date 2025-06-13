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
  Users,
  FileText,
  BarChart3,
  CreditCard,
  Monitor,
  UserCheck,
  Package,
  Handshake,
  Settings,
  Coffee,
  Heart,
  Building,
} from "lucide-react";

const modules = [
  {
    title: "Académique & Pédagogie",
    url: "/academic",
    icon: GraduationCap,
    color: "academic",
    description: "Programmes, matières, emploi du temps"
  },
  {
    title: "Gestion Étudiants",
    url: "/students",
    icon: Users,
    color: "students",
    description: "Inscriptions automatisées, profils"
  },
  {
    title: "Examens & Organisation",
    url: "/exams",
    icon: FileText,
    color: "exams",
    description: "Planification, surveillance"
  },
  {
    title: "Évaluations & Résultats",
    url: "/results",
    icon: BarChart3,
    color: "results",
    description: "Notes, bulletins < 5s"
  },
  {
    title: "Finance & Comptabilité",
    url: "/finance",
    icon: CreditCard,
    color: "finance",
    description: "Facturation, paiements"
  },
  {
    title: "eLearning & Formation",
    url: "/elearning",
    icon: Monitor,
    color: "elearning",
    description: "LMS, classes virtuelles"
  },
  {
    title: "Ressources Humaines",
    url: "/hr",
    icon: UserCheck,
    color: "hr",
    description: "Enseignants, contrats"
  },
  {
    title: "Ressources & Patrimoine",
    url: "/resources",
    icon: Package,
    color: "resources",
    description: "Inventaire, maintenance"
  },
  {
    title: "Relations & Partenariats",
    url: "/partnerships",
    icon: Handshake,
    color: "partnerships",
    description: "CRM, stages, alumni"
  },
  {
    title: "Paramètres & Config",
    url: "/settings",
    icon: Settings,
    color: "settings",
    description: "Utilisateurs, intégrations"
  },
  {
    title: "Services aux Étudiants",
    url: "/services",
    icon: Coffee,
    color: "services",
    description: "Transport, restauration"
  },
  {
    title: "Santé & Bien-être",
    url: "/health",
    icon: Heart,
    color: "health",
    description: "Dossiers médicaux, urgences"
  },
];

export function AcademicSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-academic rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Academic+</h1>
            <p className="text-xs text-muted-foreground">Gestion Éducative</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules de Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = location.pathname === module.url;
                
                return (
                  <SidebarMenuItem key={module.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={module.url}
                        className={cn(
                          "group flex items-start gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]",
                          isActive && "bg-sidebar-accent"
                        )}
                      >
                        <div 
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-110",
                            `bg-${module.color}`
                          )}
                          style={{ backgroundColor: `rgb(var(--${module.color}))` }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-sidebar-foreground truncate">
                            {module.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {module.description}
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