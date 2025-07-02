import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar, 
  Building, 
  Clock, 
  User, 
  ArrowLeft,
  BarChart3,
  FileText,
  School,
  MapPin
} from "lucide-react";

const academicSections = [
  {
    title: "Gestion Pédagogique",
    icon: BookOpen,
    defaultOpen: true,
    items: [
      { title: "Programmes", url: "/academic/programs", icon: GraduationCap },
      { title: "Filières", url: "/academic/pathways", icon: School },
      { title: "Matières", url: "/academic/subjects", icon: BookOpen },
      { title: "Niveaux d'Études", url: "/academic/levels", icon: BarChart3 }
    ]
  },
  {
    title: "Organisation",
    icon: Building,
    items: [
      { title: "Départements", url: "/academic/departments", icon: Building },
      { title: "Classes", url: "/academic/groups", icon: Users }
    ]
  },
  {
    title: "Planification",
    icon: Calendar,
    items: [
      { title: "Emploi du Temps", url: "/academic/timetables", icon: Calendar },
      { title: "Calendrier académique", url: "/academic/calendar", icon: Clock }
    ]
  },
  {
    title: "Infrastructure",
    icon: MapPin,
    items: [
      { title: "Infrastructures", url: "/academic/infrastructure", icon: Building }
    ]
  },
  {
    title: "Évaluations",
    icon: FileText,
    items: [
      { title: "Évaluations", url: "/academic/evaluations", icon: FileText }
    ]
  }
];
export function AcademicModuleSidebar() {
  const location = useLocation();
  return <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#4f7cff] rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">Gestion Académique</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Module actif</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="pt-4 pb-2">
          <Link to="/academic" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors w-full">
            <ArrowLeft className="w-4 h-4 text-sidebar-foreground" />
            <span className="text-sm text-sidebar-foreground">Retour</span>
          </Link>
        </div>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["gestion-pedagogique"]} className="w-full space-y-2">
              {academicSections.map((section, index) => {
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
                                   <span className="text-sm truncate">{item.title}</span>
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
    </Sidebar>;
}