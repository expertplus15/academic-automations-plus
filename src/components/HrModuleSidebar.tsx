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
  UserCheck,
  Users,
  FileText,
  BookOpen,
  Calendar,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  User,
  LayoutDashboard,
  Star,
} from "lucide-react";

const hrSections = [
  {
    title: "Gestion Personnel",
    icon: Users,
    defaultOpen: true,
    items: [
      { title: "Gestion enseignants", url: "/hr/teachers", icon: Users, description: "Référentiel centralisé" },
      { title: "Types de contrats", url: "/hr/contracts", icon: FileText, description: "Permanent/vacataire" }
    ]
  },
  {
    title: "Compétences",
    icon: BookOpen,
    items: [
      { title: "Spécialités & matières", url: "/hr/specialties", icon: Star, description: "Domaines expertise" },
      { title: "Disponibilités", url: "/hr/availability", icon: Calendar, description: "Planning créneaux" }
    ]
  },
  {
    title: "Performance",
    icon: TrendingUp,
    items: [
      { title: "Performance", url: "/hr/performance", icon: TrendingUp, description: "Évaluations" }
    ]
  },
  {
    title: "Intégrations",
    icon: RefreshCw,
    items: [
      { title: "Synchronisation", url: "/hr/sync", icon: RefreshCw, description: "RH ↔ Académique ↔ Finance" }
    ]
  }
];

export function HrModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#f59e0b] rounded-xl flex items-center justify-center shadow-sm">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Ressources Humaines</h1>
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
            to="/hr" 
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/hr" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/hr" && <div className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r" />}
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            <span className="text-base text-sidebar-foreground">Tableau de Bord</span>
            {location.pathname === "/hr" && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
          </Link>
        </div>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["gestion-personnel"]} className="w-full space-y-3">
              {hrSections.map((section, index) => {
                const SectionIcon = section.icon;
                const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e');
                
                // Couleurs thématiques pour HR
                const getSectionColor = (title: string) => {
                  switch (title) {
                    case 'Gestion Personnel': return 'text-amber-500';
                    case 'Compétences': return 'text-blue-500';
                    case 'Performance': return 'text-green-500';
                    case 'Intégrations': return 'text-purple-500';
                    default: return 'text-amber-500';
                  }
                };

                const sectionColor = getSectionColor(section.title);

                return (
                  <AccordionItem key={index} value={sectionId} className="border-0">
                    <AccordionTrigger className="py-3 px-3 hover:bg-sidebar-accent rounded-lg text-base font-medium text-sidebar-foreground hover:no-underline">
                      <div className="flex items-center gap-3">
                        <SectionIcon className={`w-5 h-5 ${sectionColor}`} />
                        <span>{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pt-2">
                      <SidebarMenu className="space-y-2 ml-4">
                        {section.items.map(item => {
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
                                  {isActive && <div className={`absolute left-0 w-1 h-6 ${sectionColor.replace('text-', 'bg-')} rounded-r`} />}
                                  <ItemIcon className={`w-3.5 h-3.5 ${sectionColor}`} />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-base block truncate">{item.title}</span>
                                    <span className="text-xs text-muted-foreground block truncate">{item.description}</span>
                                  </div>
                                  {isActive && <div className={`w-2 h-2 ${sectionColor.replace('text-', 'bg-')} rounded-full`} />}
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