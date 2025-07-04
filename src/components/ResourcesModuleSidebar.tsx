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
  Package,
  QrCode,
  Wrench,
  ShoppingCart,
  Calendar,
  Building,
  ArrowLeft,
  User,
  Clock,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";

const resourcesItems = [
  { title: "Inventaire numérique", url: "/resources/inventory", icon: QrCode },
  { title: "Catégories d'équipements", url: "/resources/categories", icon: Package },
  { title: "Historique mouvements", url: "/resources/history", icon: Clock },
  { title: "Maintenance préventive", url: "/resources/maintenance", icon: Wrench },
  { title: "Achats & approvisionnements", url: "/resources/procurement", icon: ShoppingCart },
  { title: "Réservation salles", url: "/resources/bookings", icon: Calendar },
  { title: "Patrimoine immobilier", url: "/resources/property", icon: Building },
  { title: "Rapports & analyses", url: "/resources/analytics", icon: BarChart3 },
  { title: "Configuration", url: "/resources/settings", icon: Settings }
];

export function ResourcesModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 border-b border-sidebar-border/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#84cc16] rounded-xl flex items-center justify-center shadow-sm">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Ressources & Patrimoine</h1>
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
          <Link 
            to="/resources" 
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/resources" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/resources" && <div className="absolute left-0 w-1 h-6 bg-lime-500 rounded-r" />}
            <Home className="w-4 h-4 text-lime-500" />
            <span className="text-base font-medium">Tableau de Bord</span>
            {location.pathname === "/resources" && <div className="w-2 h-2 bg-lime-500 rounded-full" />}
          </Link>
        </div>
        
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {resourcesItems.map(item => {
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
                        {isActive && <div className="absolute left-0 w-1 h-6 bg-lime-500 rounded-r" />}
                        <ItemIcon className="w-4 h-4 text-lime-500" />
                        <div className="flex-1 min-w-0">
                          <span className="text-base block truncate">{item.title}</span>
                        </div>
                        {isActive && <div className="w-2 h-2 bg-lime-500 rounded-full" />}
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