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
  Coffee,
  Bus,
  UtensilsCrossed,
  Home,
  BookOpen,
  Heart,
  MapPin,
  ArrowLeft,
  User,
  BarChart3,
  Globe,
  Shield,
  Activity,
  Stethoscope,
  Pill,
  AlertTriangle,
  FileText
} from "lucide-react";

const servicesSections = [
  {
    title: "Transport & Mobilité",
    icon: Bus,
    defaultOpen: true,
    items: [
      { title: "Transport scolaire", url: "/services/transport", icon: Bus, description: "Lignes & réservations" }
    ]
  },
  {
    title: "Restauration & Hébergement",
    icon: UtensilsCrossed,
    items: [
      { title: "Restauration", url: "/services/catering", icon: UtensilsCrossed, description: "Menus & commandes" },
      { title: "Hébergement", url: "/services/accommodation", icon: Home, description: "Résidences universitaires" }
    ]
  },
  {
    title: "Ressources & Activités",
    icon: BookOpen,
    items: [
      { title: "Bibliothèque", url: "/services/library", icon: BookOpen, description: "Catalogue & emprunts" },
      { title: "Activités extra-scolaires", url: "/services/activities", icon: Heart, description: "Sports & associations" }
    ]
  },
  {
    title: "Orientation & Carrières",
    icon: MapPin,
    items: [
      { title: "Orientation", url: "/services/orientation", icon: MapPin, description: "Conseils & stages" },
      { title: "Job board", url: "/services/careers", icon: Globe, description: "Offres d'emploi" }
    ]
  },
  {
    title: "Santé & Bien-être",
    icon: Shield,
    items: [
      { title: "Dossiers médicaux", url: "/services/health/records", icon: FileText, description: "Gestion des dossiers" },
      { title: "Suivi santé", url: "/services/health/appointments", icon: Stethoscope, description: "Rendez-vous médecins" },
      { title: "Médicaments", url: "/services/health/medications", icon: Pill, description: "Gestion des traitements" },
      { title: "Services d'urgence", url: "/services/health/emergency", icon: AlertTriangle, description: "Protocoles d'urgence" },
      { title: "Accessibilité", url: "/services/health/accessibility", icon: Activity, description: "Support handicap" }
    ]
  }
];

export function ServicesModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 border-b border-sidebar-border/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#ef4444] rounded-xl flex items-center justify-center shadow-sm">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Services aux Étudiants</h1>
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
            to="/services" 
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/services" && "bg-primary/10 hover:bg-primary/15 text-primary font-medium"
            )}
          >
            {location.pathname === "/services" && <div className="absolute left-0 w-1 h-6 bg-red-500 rounded-r" />}
            <BarChart3 className="w-4 h-4 text-red-500" />
            <span className="text-base">Tableau de Bord</span>
            {location.pathname === "/services" && <div className="w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
        </div>
        
        {servicesSections.map((section, index) => {
          const SectionIcon = section.icon;
          
          const getSectionColor = (title: string) => {
            switch (title) {
              case 'Transport & Mobilité': return 'text-blue-500';
              case 'Restauration & Hébergement': return 'text-green-500';
              case 'Ressources & Activités': return 'text-orange-500';
              case 'Orientation & Carrières': return 'text-purple-500';
              case 'Santé & Bien-être': return 'text-red-500';
              default: return 'text-red-500';
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