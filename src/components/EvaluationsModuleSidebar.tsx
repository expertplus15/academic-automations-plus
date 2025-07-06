import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Grid, 
  Settings, 
  Calculator, 
  TrendingUp, 
  FileSpreadsheet, 
  CheckCircle,
  Award,
  Database,
  Download,
  Upload
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

export function EvaluationsModuleSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const menuItems = [
    {
      title: "Dashboard",
      url: "/evaluations",
      icon: BarChart3,
      badge: null
    },
    {
      title: "Interface Matricielle",
      url: "/evaluations/matrix",
      icon: Grid,
      badge: "Collaboratif"
    }
  ];

  const managementItems = [
    {
      title: "Types d'Évaluations",
      url: "/evaluations/types",
      icon: Settings,
      badge: null
    },
    {
      title: "Calculs & Moyennes",
      url: "/evaluations/calculations",
      icon: Calculator,
      badge: "Auto"
    },
    {
      title: "Analytics & Tendances",
      url: "/evaluations/analytics",
      icon: TrendingUp,
      badge: null
    }
  ];

  const dataItems = [
    {
      title: "Import Excel",
      url: "/evaluations/import",
      icon: Upload,
      badge: null
    },
    {
      title: "Export & Rapports",
      url: "/evaluations/export",
      icon: Download,
      badge: null
    },
    {
      title: "Validation en Lot",
      url: "/evaluations/validation",
      icon: CheckCircle,
      badge: null
    }
  ];

  const reportsItems = [
    {
      title: "Bulletins Express",
      url: "/evaluations/reports",
      icon: FileSpreadsheet,
      badge: "< 3s"
    },
    {
      title: "Relevés de Notes",
      url: "/evaluations/transcripts",
      icon: Award,
      badge: null
    },
    {
      title: "Historique",
      url: "/evaluations/history",
      icon: Database,
      badge: null
    }
  ];

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Évaluations
        </h2>
        <p className="text-sm text-muted-foreground">
          Interface matricielle collaborative
        </p>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation Principale</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.url)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.url)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="outline" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Gestion des Données */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestion des Données</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.url)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="outline" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Rapports & Bulletins */}
        <SidebarGroup>
          <SidebarGroupLabel>Rapports & Bulletins</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.url)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}