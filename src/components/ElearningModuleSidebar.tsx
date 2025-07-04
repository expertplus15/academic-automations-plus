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
import { useAuth } from "@/contexts/AuthContext";
import {
  Monitor,
  Settings,
  Edit,
  Video,
  Play,
  MessageCircle,
  Award,
  BarChart,
  ArrowLeft,
  User,
  LayoutDashboard,
  Bell,
} from "lucide-react";

const elearningItems = [
  { title: "Mes Cours", url: "/elearning/courses", icon: Monitor },
  { title: "Standards", url: "/elearning/standards", icon: Settings },
  { title: "Éditeur", url: "/elearning/authoring", icon: Edit },
  { title: "Classes", url: "/elearning/virtual-classes", icon: Video },
  { title: "Vidéos", url: "/elearning/streaming", icon: Play },
  { title: "Forums", url: "/elearning/forums", icon: MessageCircle },
  { title: "Gamification", url: "/elearning/gamification", icon: Award },
  { title: "Notifications", url: "/elearning/notifications", icon: Bell },
  { title: "Engagement", url: "/elearning/analytics", icon: BarChart }
];

export function ElearningModuleSidebar() {
  const location = useLocation();
  const { user, profile } = useAuth();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'teacher': return 'Enseignant';
      case 'student': return 'Étudiant';
      case 'hr': return 'Ressources Humaines';
      case 'finance': return 'Finance';
      default: return 'Utilisateur';
    }
  };

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur';
  const userRole = profile?.role ? getRoleLabel(profile.role) : 'Utilisateur';

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#06b6d4] rounded-xl flex items-center justify-center shadow-sm">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">eLearning</h1>
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
            to="/elearning" 
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/elearning" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/elearning" && <div className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r" />}
            <LayoutDashboard className="w-4 h-4 text-cyan-500" />
            <span className="text-base text-sidebar-foreground">Tableau de Bord</span>
            {location.pathname === "/elearning" && <div className="w-2 h-2 bg-cyan-500 rounded-full" />}
          </Link>
        </div>
        
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {elearningItems.map(item => {
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
                        {isActive && <div className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r" />}
                        <ItemIcon className="w-4 h-4 text-cyan-500" />
                        <div className="flex-1 min-w-0">
                          <span className="text-base block truncate">{item.title}</span>
                        </div>
                        {isActive && <div className="w-2 h-2 bg-cyan-500 rounded-full" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-sidebar-foreground truncate">{userName}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{userRole}</p>
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