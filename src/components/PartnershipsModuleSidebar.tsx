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
  Handshake,
  Users,
  Briefcase,
  GraduationCap,
  Globe,
  Calendar,
  ArrowLeft,
} from "lucide-react";

const partnershipsSubModules = [
  {
    title: "CRM partenaires",
    url: "/partnerships/crm",
    icon: Handshake,
    description: "Gestion relation intégrée"
  },
  {
    title: "Gestion stages",
    url: "/partnerships/internships",
    icon: Briefcase,
    description: "Stages et insertions pro"
  },
  {
    title: "Réseau alumni",
    url: "/partnerships/alumni",
    icon: GraduationCap,
    description: "Anciens actifs - networking"
  },
  {
    title: "Échanges internationaux",
    url: "/partnerships/international",
    icon: Globe,
    description: "Programmes mobilité"
  },
  {
    title: "Organisation événements",
    url: "/partnerships/events",
    icon: Calendar,
    description: "Forums, conférences"
  },
];

export function PartnershipsModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-partnerships rounded-lg flex items-center justify-center">
            <Handshake className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Relations</h1>
            <p className="text-xs text-muted-foreground">& Partenariats</p>
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
              {partnershipsSubModules.map((subModule) => {
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
                          style={{ backgroundColor: "rgb(var(--partnerships))" }}
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