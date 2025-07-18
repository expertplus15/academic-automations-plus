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
  Building2,
  Calendar,
  Clock,
  Settings,
  ArrowLeft,
  LayoutDashboard,
  User,
  MapPin,
  Table
} from "lucide-react";

const organizationItems = [
  // Infrastructure
  { title: "Bâtiments & Salles", url: "/organization/infrastructure", icon: Building2, group: "Infrastructure" },
  { title: "Emplois du temps", url: "/organization/timetables", icon: Table, group: "Infrastructure" },
  
  // Calendrier
  { title: "Calendrier académique", url: "/organization/calendar", icon: Calendar, group: "Calendrier" },
  { title: "Horaires", url: "/organization/schedules", icon: Clock, group: "Calendrier" },
  
  // Administration
  { title: "Paramètres", url: "/organization/settings", icon: Settings, group: "Administration" }
];

const groupedItems = organizationItems.reduce((groups, item) => {
  if (!groups[item.group]) {
    groups[item.group] = [];
  }
  groups[item.group].push(item);
  return groups;
}, {} as Record<string, typeof organizationItems>);

export function OrganizationModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#059669] rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Organisation</h1>
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
            to="/organization" 
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/organization" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/organization" && <div className="absolute left-0 w-1 h-6 bg-emerald-600 rounded-r" />}
            <LayoutDashboard className="w-4 h-4 text-emerald-600" />
            <span className="text-base text-sidebar-foreground">Tableau de Bord</span>
            {location.pathname === "/organization" && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
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
                          {isActive && <div className="absolute left-0 w-1 h-6 bg-emerald-600 rounded-r" />}
                          <ItemIcon className="w-4 h-4 text-emerald-600" />
                          <div className="flex-1 min-w-0">
                            <span className="text-base block truncate">{item.title}</span>
                          </div>
                          {isActive && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
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