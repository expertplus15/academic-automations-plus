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
  BarChart3,
  Grid,
  FileOutput,
  Calculator,
  Award,
  TrendingUp,
  ArrowLeft,
  Zap,
  ClipboardList,
  PieChart,
  Upload,
  CheckCircle,
  Cpu,
  Layout,
  Brain,
  Clock
} from "lucide-react";

const resultsSections = [
  {
    title: "Saisie & Validation",
    icon: Zap,
    items: [
      { title: "Interface matricielle", url: "/results/matrix", icon: Grid, description: "Saisie collaborative" },
      { title: "Import de données", url: "/results/import", icon: Upload, description: "Excel, CSV, API" },
      { title: "Validation & Contrôle", url: "/results/validation", icon: CheckCircle, description: "Vérifications automatiques" }
    ]
  },
  {
    title: "Calculs & Traitement",
    icon: Calculator,
    items: [
      { title: "Calculs automatiques", url: "/results/calculations", icon: Calculator, description: "Moyennes, ECTS" },
      { title: "Traitement avancé", url: "/results/processing", icon: Cpu, description: "Algorithmes complexes" }
    ]
  },
  {
    title: "Génération & Export",
    icon: ClipboardList,
    items: [
      { title: "Bulletins personnalisables", url: "/results/reports", icon: FileOutput, description: "< 5 secondes" },
      { title: "Relevés standards", url: "/results/transcripts", icon: Award, description: "Standards académiques" },
      { title: "Templates & Modèles", url: "/results/templates", icon: Layout, description: "Personnalisation" }
    ]
  },
  {
    title: "Analytics & Suivi",
    icon: PieChart,
    items: [
      { title: "Analytics performance", url: "/results/analytics", icon: TrendingUp, description: "Insights avancés" },
      { title: "Insights pédagogiques", url: "/results/insights", icon: Brain, description: "IA & prédictions" },
      { title: "Historique & Audit", url: "/results/history", icon: Clock, description: "Traçabilité complète" }
    ]
  }
];

export function ResultsModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#8b5cf6] rounded-xl flex items-center justify-center shadow-sm">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Évaluations & Résultats</h1>
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
            to="/results" 
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/results" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/results" && <div className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r" />}
            <BarChart3 className="w-4 h-4 text-violet-500" />
            <span className="text-base text-sidebar-foreground">Tableau de Bord</span>
            {location.pathname === "/results" && <div className="w-2 h-2 bg-violet-500 rounded-full" />}
          </Link>
        </div>
        
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["saisie-interface"]} className="w-full space-y-3">
              {resultsSections.map((section, index) => {
                const SectionIcon = section.icon;
                const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e');
                
                // Définir les couleurs thématiques par section
                const getSectionColor = (title: string) => {
                  switch (title) {
                    case 'Saisie & Validation': return 'text-violet-500'; // Results violet
                    case 'Calculs & Traitement': return 'text-blue-500'; // Academic blue
                    case 'Génération & Export': return 'text-emerald-500'; // Export green
                    case 'Analytics & Suivi': return 'text-amber-500'; // Analytics amber
                    default: return 'text-violet-500';
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
                                  <div className="flex-1 min-w-0">
                                    <span className="text-base block truncate">{item.title}</span>
                                    <span className="text-xs text-muted-foreground block truncate">{item.description}</span>
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
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-gray-600" />
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