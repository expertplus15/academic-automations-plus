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
  DollarSign,
  FileText,
  CreditCard,
  PieChart,
  Users,
  Settings,
  BarChart3,
  Receipt,
  Wallet,
  TrendingUp,
  Calculator,
  Award,
  Calendar,
  ArrowLeft,
  Eye,
  RefreshCw,
  Target,
  User,
  LayoutDashboard
} from "lucide-react";

const financeSections = [
  {
    title: "Vue d'ensemble",
    icon: Eye,
    defaultOpen: true,
    items: [
      { title: "Tableau de bord", url: "/finance", icon: PieChart, description: "KPIs financiers" },
      { title: "Indicateurs clés", url: "/finance/dashboard", icon: TrendingUp, description: "Analytics temps réel" }
    ]
  },
  {
    title: "Gestion Courante",
    icon: RefreshCw,
    items: [
      { title: "Comptes étudiants", url: "/finance/accounts", icon: Wallet, description: "Soldes & mouvements" },
      { title: "Facturation", url: "/finance/invoices", icon: FileText, description: "Génération automatique" },
      { title: "Paiements", url: "/finance/payments", icon: CreditCard, description: "Suivi encaissements" },
      { title: "Dépenses", url: "/finance/expenses", icon: Receipt, description: "Gestion charges" }
    ]
  },
  {
    title: "Bourses & Aides",
    icon: Award,
    items: [
      { title: "Programmes de bourses", url: "/finance/scholarships", icon: Award, description: "Gestion bourses" },
      { title: "Demandes d'aide", url: "/finance/financial-aid", icon: Users, description: "Traitement demandes" },
      { title: "Attributions", url: "/finance/awards", icon: Award, description: "Suivi attributions" }
    ]
  },
  {
    title: "Budget & Analyse",
    icon: Target,
    items: [
      { title: "Vue d'ensemble", url: "/finance/budget-overview", icon: PieChart, description: "Dashboard budget" },
      { title: "Planification", url: "/finance/budget-planning", icon: TrendingUp, description: "Prévisions" },
      { title: "Suivi", url: "/finance/budget-tracking", icon: BarChart3, description: "Réalisé vs prévisionnel" },
      { title: "Rapports", url: "/finance/reports", icon: BarChart3, description: "Reporting avancé" },
      { title: "Analytics", url: "/finance/analytics", icon: PieChart, description: "Business Intelligence" }
    ]
  },
  {
    title: "Configuration",
    icon: Settings,
    items: [
      { title: "Années fiscales", url: "/finance/fiscal-years", icon: Calendar, description: "Exercices comptables" },
      { title: "Catégories", url: "/finance/categories", icon: Settings, description: "Classification" },
      { title: "Méthodes de paiement", url: "/finance/payment-methods", icon: Wallet, description: "Moyens paiement" },
      { title: "Modèles", url: "/finance/templates", icon: FileText, description: "Templates documents" },
      { title: "Échéanciers", url: "/finance/schedules", icon: Calendar, description: "Planning paiements" }
    ]
  }
];

export function FinanceModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#10b981] rounded-xl flex items-center justify-center shadow-sm">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Finance & Comptabilité</h1>
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
            to="/finance" 
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg transition-colors w-full relative",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              location.pathname === "/finance" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            )}
          >
            {location.pathname === "/finance" && <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r" />}
            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
            <span className="text-base text-sidebar-foreground">Tableau de Bord</span>
            {location.pathname === "/finance" && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
          </Link>
        </div>
        
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Accordion type="multiple" defaultValue={["vue-d-ensemble"]} className="w-full space-y-3">
              {financeSections.map((section, index) => {
                const SectionIcon = section.icon;
                const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e');
                
                // Couleurs thématiques pour Finance
                const getSectionColor = (title: string) => {
                  switch (title) {
                    case "Vue d'ensemble": return 'text-emerald-500';
                    case 'Gestion Courante': return 'text-blue-500';
                    case 'Bourses & Aides': return 'text-purple-500';
                    case 'Budget & Analyse': return 'text-orange-500';
                    case 'Configuration': return 'text-gray-500';
                    default: return 'text-emerald-500';
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