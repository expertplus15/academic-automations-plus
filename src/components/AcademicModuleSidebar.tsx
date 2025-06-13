import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  Building2,
  Clock,
  User,
} from "lucide-react";

const mainModules = [
  {
    title: "Tableau de Bord",
    url: "/",
    icon: LayoutDashboard,
    color: "#64748b",
    isActive: false
  },
  {
    title: "Gestion Académique",
    url: "/academic",
    icon: GraduationCap,
    color: "#4f7cff",
    isActive: true
  },
  {
    title: "Programmes",
    url: "/academic/programs",
    icon: BookOpen,
    color: "#10b981",
    isActive: false
  },
  {
    title: "Filières",
    url: "/academic/pathways",
    icon: BookOpen,
    color: "#06b6d4",
    isActive: false
  },
  {
    title: "Niveaux d'Études",
    url: "/academic/levels",
    icon: Users,
    color: "#f59e0b",
    isActive: false
  },
  {
    title: "Classes",
    url: "/academic/groups",
    icon: Building2,
    color: "#8b5cf6",
    isActive: false
  },
  {
    title: "Cours",
    url: "/academic/subjects",
    icon: BookOpen,
    color: "#10b981",
    isActive: false
  },
  {
    title: "Infrastructures",
    url: "/academic/infrastructure",
    icon: Building2,
    color: "#f59e0b",
    isActive: false
  },
  {
    title: "Emploi du Temps",
    url: "/academic/timetables",
    icon: Clock,
    color: "#4f7cff",
    isActive: false
  }
];

export function AcademicModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4f7cff] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Gestion Académique</h1>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainModules.map((module) => {
                const Icon = module.icon;
                const isActive = module.isActive || location.pathname === module.url;
                
                return (
                  <SidebarMenuItem key={module.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={module.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                          "text-sidebar-foreground hover:bg-sidebar-accent",
                          isActive && "text-sidebar-foreground"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 w-1 h-6 bg-[#4f7cff] rounded-r" />
                        )}
                        <div 
                          className="w-5 h-5 flex items-center justify-center"
                          style={{ color: module.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">{module.title}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-[#4f7cff] rounded-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">Administrateur Principal</p>
            <p className="text-xs text-sidebar-foreground/60">admin</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-sidebar-foreground/40">
          <p>Academic+ v1.0</p>
          <p>© 2025 MyAcademics</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}