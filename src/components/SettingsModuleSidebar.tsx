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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Settings,
  Building,
  Users,
  Palette,
  Plug,
  Activity,
  ArrowLeft,
  User,
} from "lucide-react";

const settingsSections = [
  {
    title: "Configuration Globale",
    icon: Building,
    defaultOpen: true,
    items: [
      { title: "Multi-établissements", url: "/settings/institutions", icon: Building, description: "Gestion centralisée" },
      { title: "Utilisateurs & rôles", url: "/settings/users", icon: Users, description: "RBAC contrôle accès" }
    ]
  },
  {
    title: "Interface & Intégrations",
    icon: Palette,
    items: [
      { title: "Personnalisation", url: "/settings/customization", icon: Palette, description: "Interface & thèmes" },
      { title: "Intégrations tierces", url: "/settings/integrations", icon: Plug, description: "API webhooks" }
    ]
  },
  {
    title: "Surveillance",
    icon: Activity,
    items: [
      { title: "Monitoring & logs", url: "/settings/monitoring", icon: Activity, description: "Surveillance système" }
    ]
  }
];

export function SettingsModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#6b7280] rounded-xl flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">Paramètres & Configuration</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Module actif</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="pt-4 pb-2">
          <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors w-full">
            <ArrowLeft className="w-4 h-4 text-sidebar-foreground" />
            <span className="text-sm text-sidebar-foreground">Retour</span>
          </Link>
        </div>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["configuration-globale"]} className="w-full space-y-2">
              {settingsSections.map((section, index) => {
                const SectionIcon = section.icon;
                const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e');
                return (
                  <AccordionItem key={index} value={sectionId} className="border-0">
                    <AccordionTrigger className="py-2 px-3 hover:bg-sidebar-accent rounded-lg text-sm font-medium text-sidebar-foreground hover:no-underline">
                      <div className="flex items-center gap-3">
                        <SectionIcon className="w-4 h-4 text-primary" />
                        <span>{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pt-1">
                      <SidebarMenu className="space-y-1 ml-4">
                        {section.items.map(item => {
                          const ItemIcon = item.icon;
                          const isActive = location.pathname === item.url;
                          return (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild>
                                <Link 
                                  to={item.url} 
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                                    "text-sidebar-foreground hover:bg-sidebar-accent",
                                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  )}
                                >
                                  {isActive && <div className="absolute left-0 w-1 h-5 bg-primary rounded-r" />}
                                  <ItemIcon className="w-4 h-4 text-primary" />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm block truncate">{item.title}</span>
                                    <span className="text-xs text-muted-foreground block truncate">{item.description}</span>
                                  </div>
                                  {isActive && <div className="w-2 h-2 bg-primary rounded-full" />}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
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