import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Bell, 
  Users, 
  Mail,
  Settings,
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  BookOpen,
  Activity,
  Zap,
  UserPlus,
  BarChart3
} from "lucide-react";
import { RealTimeNotificationBadge } from "@/components/communication/RealTimeNotificationBadge";
import { useAuth } from "@/hooks/useAuth";

const communicationItems = [
  {
    title: "Vue d'ensemble",
    url: "/communication",
    icon: Activity,
    description: "Dashboard principal"
  },
  {
    title: "Messages",
    url: "/communication/messages", 
    icon: MessageSquare,
    description: "Chat en temps réel",
    badge: "realtime"
  },
  {
    title: "Notifications",
    url: "/communication/notifications",
    icon: Bell,
    description: "Centre de notifications",
    badge: "realtime"
  }
];

const internalCommunicationItems = [
  {
    title: "Annonces",
    url: "/communication/internal/announcements",
    icon: Mail,
    description: "Diffusion d'informations",
    roles: ['admin', 'hr', 'teacher']
  },
  {
    title: "Emails Automatiques", 
    url: "/communication/internal/emails",
    icon: Zap,
    description: "Campagnes automatisées",
    roles: ['admin', 'hr']
  },
  {
    title: "Répertoire",
    url: "/communication/internal/directory",
    icon: Users,
    description: "Annuaire interne",
    roles: ['admin', 'hr', 'teacher']
  }
];

const externalCommunicationItems = [
  {
    title: "Partenaires CRM",
    url: "/communication/external/crm",
    icon: Globe,
    description: "Gestion partenaires",
    roles: ['admin', 'hr']
  },
  {
    title: "Stages & Emplois",
    url: "/communication/external/internships", 
    icon: Briefcase,
    description: "Opportunités pro",
    roles: ['admin', 'hr', 'teacher']
  },
  {
    title: "Alumni",
    url: "/communication/external/alumni",
    icon: GraduationCap,
    description: "Réseau des anciens",
    roles: ['admin', 'hr']
  },
  {
    title: "Relations Internationales",
    url: "/communication/external/international",
    icon: Globe,
    description: "Partenariats mondiaux",
    roles: ['admin', 'hr']
  },
  {
    title: "Événements",
    url: "/communication/external/events",
    icon: Calendar,
    description: "Événements externes",
    roles: ['admin', 'hr', 'teacher']
  }
];

const systemItems = [
  {
    title: "Intégrations",
    url: "/communication/integrations",
    icon: Zap,
    description: "API et connecteurs",
    roles: ['admin']
  },
  {
    title: "Analytiques",
    url: "/communication/analytics", 
    icon: BarChart3,
    description: "Statistiques détaillées",
    roles: ['admin', 'hr']
  },
  {
    title: "Configuration",
    url: "/communication/settings",
    icon: Settings,
    description: "Paramètres du module",
    roles: ['admin']
  }
];

export function CommunicationModuleSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { hasRole } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/communication") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  const renderMenuItem = (item: any) => {
    // Check permissions if roles are specified
    if (item.roles && !hasRole(item.roles)) {
      return null;
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild className={getNavClassName(item.url)}>
          <NavLink to={item.url} className="flex items-center gap-3 w-full">
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {item.badge === "realtime" && <RealTimeNotificationBadge />}
                  {item.count && (
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  // Determine which groups should be expanded based on current path
  const isMainGroupExpanded = currentPath === "/communication" || 
    currentPath.startsWith("/communication/messages") || 
    currentPath.startsWith("/communication/notifications");
  
  const isInternalGroupExpanded = currentPath.startsWith("/communication/internal");
  const isExternalGroupExpanded = currentPath.startsWith("/communication/external");
  const isSystemGroupExpanded = currentPath.startsWith("/communication/integrations") ||
    currentPath.startsWith("/communication/analytics") ||
    currentPath.startsWith("/communication/settings");

  return (
    <Sidebar 
      className={collapsed ? "w-16" : "w-72"}
    >
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-foreground">Communication</h2>
              <p className="text-xs text-muted-foreground">Module de communication intégrée</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="p-2">
        {/* Main Communication Features */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            Fonctionnalités Principales
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communicationItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Internal Communication */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            Communication Interne
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {internalCommunicationItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* External Communication */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            Relations Externes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {externalCommunicationItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System & Configuration */}
        {hasRole(['admin', 'hr']) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
              Système & Analytics
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {systemItems.map(renderMenuItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Status Footer */}
      {!collapsed && (
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Tous les services opérationnels</span>
          </div>
        </div>
      )}
    </Sidebar>
  );
}