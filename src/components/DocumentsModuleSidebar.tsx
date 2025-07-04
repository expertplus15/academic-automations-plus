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
  FolderOpen,
  PenTool,
  Archive,
  FileSignature,
  Send,
  Settings,
  Shield,
  ArrowLeft,
  User,
  BarChart3,
  Layout,
  Stamp
} from "lucide-react";

const documentsSections = [
  {
    title: "Templates & Modèles",
    icon: Layout,
    defaultOpen: true,
    items: [
      { title: "Modèles de documents", url: "/documents/templates", icon: Layout },
      { title: "Générateur de docs", url: "/documents/generator", icon: PenTool }
    ]
  },
  {
    title: "Archives & Stockage",
    icon: Archive,
    items: [
      { title: "Centre d'archives", url: "/documents/archives", icon: Archive },
      { title: "Recherche avancée", url: "/documents/search", icon: FolderOpen }
    ]
  },
  {
    title: "Signatures & Validation",
    icon: FileSignature,
    items: [
      { title: "Signatures électroniques", url: "/documents/signatures", icon: FileSignature },
      { title: "Validation officielle", url: "/documents/validation", icon: Stamp }
    ]
  },
  {
    title: "Distribution & Envoi",
    icon: Send,
    items: [
      { title: "Envoi automatique", url: "/documents/distribution", icon: Send },
      { title: "Notifications", url: "/documents/notifications", icon: BarChart3 }
    ]
  },
  {
    title: "Paramètres & Conformité",
    icon: Shield,
    items: [
      { title: "Paramètres", url: "/documents/settings", icon: Settings },
      { title: "Conformité RGPD", url: "/documents/compliance", icon: Shield }
    ]
  }
];

export function DocumentsModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 border-b border-sidebar-border/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#4F78FF] rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Gestion Documentaire</h1>
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
            to="/documents" 
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/documents" && "bg-primary/10 hover:bg-primary/15 text-primary font-medium"
            )}
          >
            {location.pathname === "/documents" && <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r" />}
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-base">Tableau de Bord</span>
            {location.pathname === "/documents" && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
          </Link>
        </div>
        
        {documentsSections.map((section, index) => {
          
          const getSectionColor = (title: string) => {
            switch (title) {
              case 'Templates & Modèles': return 'text-blue-500';
              case 'Archives & Stockage': return 'text-green-500';
              case 'Signatures & Validation': return 'text-purple-500';
              case 'Distribution & Envoi': return 'text-orange-500';
              case 'Paramètres & Conformité': return 'text-red-500';
              default: return 'text-blue-500';
            }
          };

          const sectionColor = getSectionColor(section.title);
          
          return (
            <SidebarGroup key={index} className="py-2">
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {section.items.map(item => {
                    const ItemIcon = item.icon;
                    const isActive = location.pathname === item.url;
                    const itemColor = getSectionColor(section.title);
                    
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
                            {isActive && <div className={`absolute left-0 w-1 h-6 ${itemColor.replace('text-', 'bg-')} rounded-r`} />}
                            <ItemIcon className={`w-3.5 h-3.5 ${itemColor}`} />
                            <div className="flex-1 min-w-0">
                              <span className="text-base block truncate">{item.title}</span>
                            </div>
                            {isActive && <div className={`w-2 h-2 ${itemColor.replace('text-', 'bg-')} rounded-full`} />}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
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