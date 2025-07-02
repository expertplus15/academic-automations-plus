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
  Users,
  UserPlus,
  User,
  Activity,
  Bell,
  FileText,
  MessageSquare,
  ArrowLeft,
  Zap,
  BarChart3,
  AlertCircle,
  Mail
} from "lucide-react";

const studentsSections = [
  {
    title: "Inscription Express",
    icon: Zap,
    defaultOpen: true,
    items: [
      { title: "Inscription automatisée", url: "/students/registration", icon: UserPlus, description: "< 30 secondes" },
      { title: "Tableau de bord", url: "/students/registration/dashboard", icon: BarChart3, description: "Vue d'ensemble" },
      { title: "Analyses", url: "/students/registration/analytics", icon: BarChart3, description: "Statistiques" },
      { title: "Approbations", url: "/students/registration/approval", icon: AlertCircle, description: "Validations" },
      { title: "Entretiens", url: "/students/registration/interviews", icon: Mail, description: "Planification" },
      { title: "Configuration", url: "/students/registration/settings", icon: AlertCircle, description: "Paramètres" }
    ]
  },
  {
    title: "Profils & Suivi",
    icon: User,
    items: [
      { title: "Profils étudiants", url: "/students/profiles", icon: User, description: "Profils complets" },
      { title: "Suivi académique", url: "/students/tracking", icon: Activity, description: "Temps réel" }
    ]
  },
  {
    title: "Communication",
    icon: MessageSquare,
    items: [
      { title: "Alertes automatiques", url: "/students/alerts", icon: Bell, description: "Absences, notes" },
      { title: "Communication intégrée", url: "/students/communication", icon: MessageSquare, description: "Messagerie" }
    ]
  },
  {
    title: "Documents",
    icon: FileText,
    items: [
      { title: "Documents administratifs", url: "/students/documents", icon: FileText, description: "Certificats" }
    ]
  }
];

export function StudentsModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#10b981] rounded-xl flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Gestion Étudiants</h1>
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
            to="/students" 
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/students" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/students" && <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r" />}
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span className="text-base text-sidebar-foreground">Tableau de Bord</span>
            {location.pathname === "/students" && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
          </Link>
        </div>
        
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["inscription-express"]} className="w-full space-y-3">
              {studentsSections.map((section, index) => {
                const SectionIcon = section.icon;
                const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e');
                
                // Définir les couleurs thématiques par section
                const getSectionColor = (title: string) => {
                  switch (title) {
                    case 'Inscription Express': return 'text-emerald-500'; // Students green
                    case 'Profils & Suivi': return 'text-blue-500'; // Academic blue  
                    case 'Communication': return 'text-violet-500'; // Communication violet
                    case 'Documents': return 'text-orange-500'; // Documents orange
                    default: return 'text-emerald-500';
                  }
                };

                const getItemColor = (sectionTitle: string, itemTitle: string) => {
                  const baseColor = getSectionColor(sectionTitle);
                  return baseColor;
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
                          const itemColor = getItemColor(section.title, item.title);
                          
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
                                  <span className="text-base truncate">{item.title}</span>
                                  {isActive && <div className={`w-2 h-2 ${itemColor.replace('text-', 'bg-')} rounded-full`} />}
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
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
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