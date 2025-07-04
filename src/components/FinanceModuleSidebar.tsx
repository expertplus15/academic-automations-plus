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
  CheckCircle,
  Building
} from "lucide-react";

const financeItems = [
  { title: "Facturation Unifiée", url: "/finance/invoices", icon: FileText },
  { title: "Avoirs & Corrections", url: "/finance/credits", icon: RefreshCw },
  { title: "Trésorerie & Hub Paiements", url: "/finance/treasury-payments", icon: Wallet },
  { title: "Suivi des Créances", url: "/finance/receivables", icon: PieChart },
  { title: "Réconciliation Auto", url: "/finance/reconciliation", icon: Zap },
  { title: "Scoring Risques", url: "/finance/risk-scoring", icon: AlertTriangle },
  { title: "Gestion des Dépenses", url: "/finance/expenses", icon: Receipt },
  { title: "Postes de Dépenses", url: "/finance/expense-categories", icon: Target },
  { title: "Fournisseurs", url: "/finance/suppliers", icon: Building },
  { title: "Écritures Auto", url: "/finance/accounting", icon: Calculator },
  { title: "Analytique Multi-axes", url: "/finance/analytics-accounting", icon: BarChart3 },
  { title: "États Financiers", url: "/finance/statements", icon: FileText },
  { title: "Intelligence Financière", url: "/finance/admin-ia", icon: Bot },
  { title: "Gestionnaire Budgétaire", url: "/finance/budget-manager", icon: Calculator },
  { title: "Contrôle de Gestion", url: "/finance/management-control", icon: Target },
  { title: "Clôtures Rapides", url: "/finance/closing", icon: CheckCircle },
  { title: "Configuration Système", url: "/finance/config", icon: Settings },
  { title: "Paramètres Fiscaux", url: "/finance/tax-settings", icon: Calculator },
  { title: "Gestion des Utilisateurs", url: "/finance/users", icon: User },
  { title: "Sauvegardes", url: "/finance/backups", icon: RefreshCw }
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
        
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {financeItems.map(item => {
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
                        {isActive && <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r" />}
                        <ItemIcon className="w-4 h-4 text-emerald-500" />
                        <div className="flex-1 min-w-0">
                          <span className="text-base block truncate">{item.title}</span>
                        </div>
                        {isActive && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
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