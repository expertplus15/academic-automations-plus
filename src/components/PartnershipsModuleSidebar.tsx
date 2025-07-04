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
  Handshake,
  Users,
  Briefcase,
  GraduationCap,
  Globe,
  Calendar,
  ArrowLeft,
  User,
} from "lucide-react";

const partnershipsSections = [
  {
    title: "Relations Partenaires",
    icon: Handshake,
    color: "text-pink-500",
    defaultOpen: true,
    items: [
      { title: "CRM partenaires", url: "/partnerships/crm", icon: Handshake, description: "Gestion relations" },
      { title: "Gestion stages", url: "/partnerships/internships", icon: Briefcase, description: "Stages & insertions" }
    ]
  },
  {
    title: "Réseau Alumni",
    icon: GraduationCap,
    color: "text-purple-500",
    items: [
      { title: "Réseau alumni", url: "/partnerships/alumni", icon: GraduationCap, description: "Anciens & networking" }
    ]
  },
  {
    title: "International & Événements",
    icon: Globe,
    color: "text-green-500",
    items: [
      { title: "Échanges internationaux", url: "/partnerships/international", icon: Globe, description: "Programmes mobilité" },
      { title: "Organisation événements", url: "/partnerships/events", icon: Calendar, description: "Forums & conférences" }
    ]
  }
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
            <Accordion type="multiple" defaultValue={["relations-partenaires"]} className="w-full space-y-3">
              {partnershipsSections.map((section, index) => {
                const SectionIcon = section.icon;
                const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e');
                return (
                  <AccordionItem key={index} value={sectionId} className="border-0">
                    <AccordionTrigger className="py-3 px-3 hover:bg-sidebar-accent rounded-lg text-base font-medium text-sidebar-foreground hover:no-underline">
                      <div className="flex items-center gap-3">
                        <SectionIcon className={cn("w-5 h-5", section.color)} />
                        <span>{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pt-2">
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
                                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative",
                                    "text-sidebar-foreground hover:bg-sidebar-accent",
                                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  )}
                                >
                                  {isActive && <div className={cn("absolute left-0 w-1 h-6 rounded-r", section.color.replace('text-', 'bg-'))} />}
                                  <ItemIcon className={cn("w-3.5 h-3.5", section.color)} />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-base block truncate">{item.title}</span>
                                    <span className="text-sm text-muted-foreground block truncate">{item.description}</span>
                                  </div>
                                  {isActive && <div className={cn("w-2 h-2 rounded-full", section.color.replace('text-', 'bg-'))} />}
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