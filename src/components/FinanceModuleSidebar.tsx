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
  CreditCard,
  Receipt,
  Banknote,
  Calculator,
  Users,
  PieChart,
  BarChart,
  ArrowLeft,
} from "lucide-react";

const financeSubModules = [
  {
    title: "Facturation automatique",
    url: "/finance/billing",
    icon: Receipt,
    color: "#4f7cff",
    description: "Instantané"
  },
  {
    title: "Gestion paiements",
    url: "/finance/payments",
    icon: CreditCard,
    color: "#10b981",
    description: "Paiements"
  },
  {
    title: "Comptabilité générale",
    url: "/finance/accounting",
    icon: Calculator,
    color: "#f59e0b",
    description: "Automatisée"
  },
  {
    title: "Paie enseignants",
    url: "/finance/payroll",
    icon: Users,
    color: "#8b5cf6",
    description: "Permanent/vacataire"
  },
  {
    title: "Budgets & prévisions",
    url: "/finance/budgets",
    icon: PieChart,
    color: "#06b6d4",
    description: "Planification"
  },
  {
    title: "Reporting financier",
    url: "/finance/reporting",
    icon: BarChart,
    color: "#ef4444",
    description: "Analytics"
  },
];

export function FinanceModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-finance rounded-xl flex items-center justify-center shadow-sm">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">Gestion Finance</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Module actif</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="pt-4 pb-2">
          <Link to="/finance" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors w-full">
            <ArrowLeft className="w-4 h-4 text-sidebar-foreground" />
            <span className="text-sm text-sidebar-foreground">Retour</span>
          </Link>
        </div>
        <SidebarGroup className="py-[22px] my-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {financeSubModules.map(module => {
                const Icon = module.icon;
                const isActive = location.pathname === module.url;
                return (
                  <SidebarMenuItem key={module.title}>
                    <SidebarMenuButton asChild>
                      <Link to={module.url} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative", "text-sidebar-foreground hover:bg-sidebar-accent", isActive && "text-sidebar-foreground")}>
                        {isActive && <div className="absolute left-0 w-1 h-6 bg-finance rounded-r" />}
                        <div className="w-5 h-5 flex items-center justify-center" style={{ color: module.color }}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">{module.title}</span>
                        {isActive && <div className="ml-auto w-2 h-2 bg-finance rounded-full" />}
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
            <Users className="w-4 h-4 text-gray-600" />
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