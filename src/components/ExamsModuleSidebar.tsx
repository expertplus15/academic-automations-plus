
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
  FileText,
  Calendar,
  Building,
  Users,
  Mail,
  Monitor,
  AlertTriangle,
  ArrowLeft,
  Bot,
  MapPin,
  MessageCircle,
  BarChart3,
  User,
  LayoutDashboard,
  PenTool,
  TrendingUp,
  Download,
  Settings,
  CalendarDays
} from "lucide-react";

const examsItems = [
  // Gestion Sessions (nouveau)
  { title: "Gestion Sessions", url: "/exams/sessions", icon: CalendarDays, group: "Sessions" },
  
  // Gestion
  { title: "Création d'examen", url: "/exams/creation", icon: PenTool, group: "Gestion" },
  { title: "Planification examens", url: "/exams/planning", icon: Calendar, group: "Gestion" },
  { title: "Calendrier", url: "/exams/calendar", icon: Calendar, group: "Gestion" },
  
  // Intelligence
  { title: "Optimisation automatique", url: "/exams/optimization", icon: BarChart3, group: "Intelligence" },
  { title: "Analytics", url: "/exams/analytics", icon: TrendingUp, group: "Intelligence" },
  
  // Opérations
  { title: "Gestion salles", url: "/exams/rooms", icon: Building, group: "Opérations" },
  { title: "Attribution surveillants", url: "/exams/supervisors", icon: Users, group: "Opérations" },
  { title: "Convocations massives", url: "/exams/invitations", icon: Mail, group: "Opérations" },
  
  // Surveillance
  { title: "Surveillance temps réel", url: "/exams/monitoring", icon: Monitor, group: "Surveillance" },
  { title: "Incidents & PV", url: "/exams/incidents", icon: AlertTriangle, group: "Surveillance" },
  
  // Administration
  { title: "Rapports", url: "/exams/reports", icon: Download, group: "Administration" },
  { title: "Paramètres", url: "/exams/settings", icon: Settings, group: "Administration" }
];

const groupedItems = examsItems.reduce((groups, item) => {
  if (!groups[item.group]) {
    groups[item.group] = [];
  }
  groups[item.group].push(item);
  return groups;
}, {} as Record<string, typeof examsItems>);

export function ExamsModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#8b5cf6] rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Examens IA</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Module actif</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="pt-4 pb-2 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-sidebar-accent transition-colors w-full">
            <ArrowLeft className="w-4 h-4 text-sidebar-foreground" />
            <span className="text-base text-sidebar-foreground">Retour au Dashboard</span>
          </Link>
          <Link 
            to="/exams" 
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/exams" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/exams" && <div className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r" />}
            <LayoutDashboard className="w-4 h-4 text-violet-500" />
            <span className="text-base text-sidebar-foreground">Tableau de Bord</span>
            {location.pathname === "/exams" && <div className="w-2 h-2 bg-violet-500 rounded-full" />}
          </Link>
        </div>
        
        
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName} className="py-2">
            <div className="px-3 pb-2">
              <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
                {groupName}
              </h3>
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map(item => {
                  const ItemIcon = item.icon;
                  const isActive = location.pathname === item.url;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.url} 
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative",
                            "text-sidebar-foreground hover:bg-sidebar-accent",
                            isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          )}
                        >
                          {isActive && <div className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r" />}
                          <ItemIcon className="w-4 h-4 text-violet-500" />
                          <div className="flex-1 min-w-0">
                            <span className="text-base block truncate">{item.title}</span>
                          </div>
                          {isActive && <div className="w-2 h-2 bg-violet-500 rounded-full" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-sidebar-foreground truncate">Administrateur Principal</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">admin</p>
          </div>
        </div>
        <div className="space-y-1 text-xs text-sidebar-foreground/50">
          <p>version 2.1.4</p>
          <div className="flex items-center gap-2">
            <span>Système OK</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
