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
  Handshake,
  Users,
  Briefcase,
  GraduationCap,
  Globe,
  Calendar,
  ArrowLeft,
  User,
} from "lucide-react";

const partnershipsLinks = [
  { title: "CRM partenaires", url: "/partnerships/crm", icon: Handshake, description: "Gestion relations", color: "text-pink-500" },
  { title: "Gestion stages", url: "/partnerships/internships", icon: Briefcase, description: "Stages & insertions", color: "text-pink-500" },
  { title: "Réseau alumni", url: "/partnerships/alumni", icon: GraduationCap, description: "Anciens & networking", color: "text-purple-500" },
  { title: "Échanges internationaux", url: "/partnerships/international", icon: Globe, description: "Programmes mobilité", color: "text-green-500" },
  { title: "Organisation événements", url: "/partnerships/events", icon: Calendar, description: "Forums & conférences", color: "text-green-500" }
];

export function PartnershipsModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 border-b border-sidebar-border/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#ec4899] rounded-xl flex items-center justify-center shadow-sm">
            <Handshake className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Relations & Partenariats</h1>
            <p className="text-sm text-sidebar-foreground/60 mt-0.5">Module actif</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="pt-4 pb-3 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent transition-colors w-full text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-base">Retour au Dashboard</span>
          </Link>
          <Link to="/partnerships" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 hover:bg-primary/15 transition-colors w-full">
            <Handshake className="w-4 h-4 text-primary" />
            <span className="text-base font-medium text-primary">Tableau de Bord</span>
          </Link>
        </div>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {partnershipsLinks.map(link => {
                const LinkIcon = link.icon;
                const isActive = location.pathname === link.url;
                return (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={link.url} 
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative",
                          "text-sidebar-foreground hover:bg-sidebar-accent",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        )}
                      >
                        {isActive && <div className={cn("absolute left-0 w-1 h-6 rounded-r", link.color.replace('text-', 'bg-'))} />}
                        <LinkIcon className={cn("w-4 h-4", link.color)} />
                        <div className="flex-1 min-w-0">
                          <span className="text-base block truncate">{link.title}</span>
                        </div>
                        {isActive && <div className={cn("w-2 h-2 rounded-full", link.color.replace('text-', 'bg-'))} />}
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
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Administrateur Principal</p>
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