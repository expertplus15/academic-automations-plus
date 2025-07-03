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
  LayoutDashboard,
  Bot,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const financeSections = [
  {
    title: "Facturation",
    icon: FileText,
    defaultOpen: true,
    items: [
      { title: "Facturation Étudiante", url: "/finance/invoices", icon: FileText, description: "Scolarité & frais" },
      { title: "Facturation Commerciale", url: "/finance/commercial", icon: Receipt, description: "Prestations B2B" },
      { title: "Avoirs & Corrections", url: "/finance/credits", icon: RefreshCw, description: "Régularisations automatiques" }
    ]
  },
  {
    title: "Trésorerie",
    icon: Wallet,
    items: [
      { title: "Hub Paiements", url: "/finance/payments", icon: CreditCard, description: "Tous moyens de paiement" },
      { title: "Trésorerie Live", url: "/finance/treasury", icon: Wallet, description: "Position temps réel + prédictions" },
      { title: "Suivi des Créances", url: "/finance/receivables", icon: PieChart, description: "Analytics & recouvrement" },
      { title: "Réconciliation Auto", url: "/finance/reconciliation", icon: Zap, description: "Matching intelligent" },
      { title: "Scoring Risques", url: "/finance/risk-scoring", icon: AlertTriangle, description: "Prédiction défaillances" }
    ]
  },
  {
    title: "Comptabilité",
    icon: Calculator,
    items: [
      { title: "Écritures Auto", url: "/finance/accounting", icon: Calculator, description: "Comptabilisation automatique" },
      { title: "Analytique Multi-axes", url: "/finance/analytics-accounting", icon: BarChart3, description: "Centres de coût" },
      { title: "États Financiers", url: "/finance/statements", icon: FileText, description: "Bilan & compte résultat" }
    ]
  },
  {
    title: "Pilotage",
    icon: Bot,
    items: [
      { title: "Intelligence Financière", url: "/finance/admin-ia", icon: Bot, description: "IA prédictive & optimisation" },
      { title: "Gestionnaire Budgétaire", url: "/finance/budget-manager", icon: Calculator, description: "Pilotage budgets unifié" },
      { title: "Contrôle de Gestion", url: "/finance/management-control", icon: Target, description: "KPIs & tableaux de bord" },
      { title: "Clôtures Rapides", url: "/finance/closing", icon: CheckCircle, description: "Automatisation J+3" }
    ]
  },
  {
    title: "Paramètres",
    icon: Settings,
    items: [
      { title: "Configuration Système", url: "/finance/config", icon: Settings, description: "Plan comptable & paramètres" },
      { title: "Paramètres Fiscaux", url: "/finance/tax-settings", icon: Calculator, description: "TVA & réglementations" },
      { title: "Gestion des Utilisateurs", url: "/finance/users", icon: User, description: "Droits & permissions" },
      { title: "Sauvegardes", url: "/finance/backups", icon: RefreshCw, description: "Archivage & restauration" }
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