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
  MessageSquare,
  Users,
  Building,
  Globe,
  Bell,
  Settings,
  ArrowLeft,
  User,
  BarChart3,
  Phone,
  Mail,
  Video,
  Handshake,
  GraduationCap,
  Briefcase
} from "lucide-react";

const communicationSections = [
  {
    title: "Messagerie Intégrée",
    icon: MessageSquare,
    defaultOpen: true,
    items: [
      { title: "Messages instantanés", url: "/communication/messages", icon: MessageSquare, description: "Chat en temps réel" },
      { title: "Appels & Visio", url: "/communication/calls", icon: Video, description: "Communication vocale/vidéo" },
      { title: "Notifications", url: "/communication/notifications", icon: Bell, description: "Centre de notifications" }
    ]
  },
  {
    title: "Relations Externes",
    icon: Building,
    items: [
      { title: "Partenaires CRM", url: "/communication/external/crm", icon: Handshake, description: "Gestion partenaires" },
      { title: "Stages & Emplois", url: "/communication/external/internships", icon: Briefcase, description: "Opportunités professionnelles" },
      { title: "Alumni", url: "/communication/external/alumni", icon: GraduationCap, description: "Réseau diplômés" },
      { title: "Relations internationales", url: "/communication/external/international", icon: Globe, description: "Partenariats globaux" },
      { title: "Événements", url: "/communication/external/events", icon: Users, description: "Organisation événements" }
    ]
  },
  {
    title: "Communication Interne",
    icon: Users,
    items: [
      { title: "Annonces officielles", url: "/communication/internal/announcements", icon: Bell, description: "Communications officielles" },
      { title: "Emails automatiques", url: "/communication/internal/emails", icon: Mail, description: "Envois programmés" },
      { title: "Répertoire interne", url: "/communication/internal/directory", icon: Phone, description: "Contacts organisation" }
    ]
  },
  {
    title: "Intégrations",
    icon: Settings,
    items: [
      { title: "Paramètres", url: "/communication/settings", icon: Settings, description: "Configuration système" },
      { title: "APIs externes", url: "/communication/integrations", icon: Globe, description: "Connecteurs tiers" }
    ]
  }
];

export function CommunicationModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 border-b border-sidebar-border/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#8B5CF6] rounded-xl flex items-center justify-center shadow-sm">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Communication & Relations</h1>
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
            to="/communication" 
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/communication" && "bg-primary/10 hover:bg-primary/15 text-primary font-medium"
            )}
          >
            {location.pathname === "/communication" && <div className="absolute left-0 w-1 h-6 bg-purple-500 rounded-r" />}
            <BarChart3 className="w-4 h-4 text-purple-500" />
            <span className="text-base">Tableau de Bord</span>
            {location.pathname === "/communication" && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
          </Link>
        </div>
        
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["messagerie-integree"]} className="w-full space-y-3">
              {communicationSections.map((section, index) => {
                const SectionIcon = section.icon;
                const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e');
                
                const getSectionColor = (title: string) => {
                  switch (title) {
                    case 'Messagerie Intégrée': return 'text-blue-500';
                    case 'Relations Externes': return 'text-purple-500';
                    case 'Communication Interne': return 'text-green-500';
                    case 'Intégrations': return 'text-orange-500';
                    default: return 'text-purple-500';
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
                                    <span className="text-sm text-muted-foreground block truncate">{item.description}</span>
                                  </div>
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