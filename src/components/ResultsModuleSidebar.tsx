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
} from "lucide-react";

const resultsSubModules = [
  {
    title: "Interface matricielle",
    url: "/results/matrix",
    icon: Grid,
    color: "#4f7cff",
    description: "Saisie collaborative"
  },
  {
    title: "Bulletins personnalisables",
    url: "/results/reports",
    icon: FileOutput,
    color: "#10b981",
    description: "< 5 secondes"
  },
  {
    title: "Calculs automatiques",
    url: "/results/calculations",
    icon: Calculator,
    color: "#f59e0b",
    description: "Moyennes, ECTS"
  },
  {
    title: "Relevés standards",
    url: "/results/transcripts",
    icon: Award,
    color: "#8b5cf6",
    description: "Standards académiques"
  },
  {
    title: "Analytics performance",
    url: "/results/analytics",
    icon: TrendingUp,
    color: "#06b6d4",
    description: "Insights avancés"
  },
];

export function ResultsModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-results rounded-xl flex items-center justify-center shadow-sm">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">Évaluations & Résultats</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Module actif</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="pt-4 pb-2">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors w-full">
            <ArrowLeft className="w-4 h-4 text-sidebar-foreground" />
            <span className="text-sm text-sidebar-foreground">Retour</span>
          </Link>
        </div>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["saisie-rapide"]} className="w-full space-y-2">
              <AccordionItem value="saisie-rapide" className="border-0">
                <AccordionTrigger className="py-2 px-3 hover:bg-sidebar-accent rounded-lg text-sm font-medium text-sidebar-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Grid className="w-4 h-4 text-primary" />
                    <span>Interface Matricielle</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pt-1">
                  <SidebarMenu className="space-y-1 ml-4">
                    {resultsSubModules.map(module => {
                      const Icon = module.icon;
                      const isActive = location.pathname === module.url;
                      return (
                        <SidebarMenuItem key={module.title}>
                          <SidebarMenuButton asChild>
                            <Link 
                              to={module.url} 
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                                "text-sidebar-foreground hover:bg-sidebar-accent",
                                isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              )}
                            >
                              {isActive && <div className="absolute left-0 w-1 h-5 bg-primary rounded-r" />}
                              <Icon className="w-4 h-4 text-primary" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm block truncate">{module.title}</span>
                                <span className="text-xs text-muted-foreground block truncate">{module.description}</span>
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
            </Accordion>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-gray-600" />
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