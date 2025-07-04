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
    title: "Pédagogie",
    icon: BookOpen,
    defaultOpen: true,
    items: [
      { title: "Programmes", url: "/academic/programs", icon: GraduationCap },
      { title: "Filières", url: "/academic/pathways", icon: School },
      { title: "Matières", url: "/academic/subjects", icon: BookOpen },
      { title: "Niveaux", url: "/academic/levels", icon: BarChart3 }
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
      { title: "Calendrier", url: "/academic/calendar", icon: Clock }
    ]
  },
  {
    title: "Infrastructure",
    icon: MapPin,
    items: [
      { title: "Infrastructures", url: "/academic/infrastructure", icon: Building }
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
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Gestion Académique</h1>
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
            to="/academic" 
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/academic" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/academic" && <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r" />}
            <LayoutDashboard className="w-4 h-4 text-blue-500" />
            <span className="text-base text-sidebar-foreground">Tableau de Bord</span>
            {location.pathname === "/academic" && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
          </Link>
        </div>
        {academicSections.map((section, index) => {
          const SectionIcon = section.icon;
          
          const getSectionColor = (title: string) => {
            switch (title) {
              case 'Pédagogie': return 'text-blue-500';
              case 'Organisation': return 'text-emerald-500';
              case 'Planification': return 'text-violet-500';
              case 'Infrastructure': return 'text-orange-500';
              default: return 'text-blue-500';
            }
          };

          const sectionColor = getSectionColor(section.title);

          return (
            <SidebarGroup key={index} className="py-2">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <SectionIcon className={`w-4 h-4 ${sectionColor}`} />
                <span className="text-sm font-medium text-sidebar-foreground/80">{section.title}</span>
              </div>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
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
                            <span className="text-base block truncate">{item.title}</span>
                            {isActive && <div className={`w-2 h-2 ${sectionColor.replace('text-', 'bg-')} rounded-full`} />}
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
    </Sidebar>;
}