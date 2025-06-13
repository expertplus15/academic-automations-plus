import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, GraduationCap, BookOpen, Users, Calendar, ClipboardList, Building2, Clock, User, ArrowLeft, Eye, BarChart, Settings, LogOut } from "lucide-react";
const mainModules = [{
  title: "Tableau de Bord",
  url: "/",
  icon: LayoutDashboard,
  color: "#64748b",
  isActive: false
}, {
  title: "Gestion Académique",
  url: "/academic",
  icon: GraduationCap,
  color: "#4f7cff",
  isActive: true
}, {
  title: "Programmes",
  url: "/academic/programs",
  icon: BookOpen,
  color: "#10b981",
  isActive: false
}, {
  title: "Filières",
  url: "/academic/pathways",
  icon: BookOpen,
  color: "#06b6d4",
  isActive: false
}, {
  title: "Niveaux d'Études",
  url: "/academic/levels",
  icon: Users,
  color: "#f59e0b",
  isActive: false
}, {
  title: "Classes",
  url: "/academic/groups",
  icon: Building2,
  color: "#8b5cf6",
  isActive: false
}, {
  title: "Cours",
  url: "/academic/subjects",
  icon: BookOpen,
  color: "#10b981",
  isActive: false
}, {
  title: "Infrastructures",
  url: "/academic/infrastructure",
  icon: Building2,
  color: "#f59e0b",
  isActive: false
}, {
  title: "Emploi du Temps",
  url: "/academic/timetables",
  icon: Clock,
  color: "#4f7cff",
  isActive: false
}];
export function AcademicModuleSidebar() {
  const location = useLocation();
  return <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#4f7cff] rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">Gestion Académique</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Module actif</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="pt-4 pb-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors w-full">
            <ArrowLeft className="w-4 h-4 text-sidebar-foreground" />
            <span className="text-sm text-sidebar-foreground">Retour</span>
          </button>
        </div>
        <SidebarGroup className="my-[34px] py-[22px]">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainModules.map(module => {
              const Icon = module.icon;
              const isActive = module.isActive || location.pathname === module.url;
              return <SidebarMenuItem key={module.title}>
                    <SidebarMenuButton asChild>
                      <Link to={module.url} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative", "text-sidebar-foreground hover:bg-sidebar-accent", isActive && "text-sidebar-foreground")}>
                        {isActive && <div className="absolute left-0 w-1 h-6 bg-[#4f7cff] rounded-r" />}
                        <div className="w-5 h-5 flex items-center justify-center" style={{
                      color: module.color
                    }}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">{module.title}</span>
                        {isActive && <div className="ml-auto w-2 h-2 bg-[#4f7cff] rounded-full" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Administrateur Principal</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">admin</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
            <User className="w-3 h-3 text-sidebar-foreground" />
            <span className="text-xs text-sidebar-foreground">Profil</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
            <Settings className="w-3 h-3 text-sidebar-foreground" />
            <span className="text-xs text-sidebar-foreground">Config</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
            <LogOut className="w-3 h-3 text-sidebar-foreground" />
            <span className="text-xs text-sidebar-foreground">Sortir</span>
          </button>
        </div>
        <div className="space-y-1 text-xs text-sidebar-foreground/50">
          <p>version 2.1.4</p>
          <div className="flex items-center gap-2">
            <span>Système OK</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>;
}