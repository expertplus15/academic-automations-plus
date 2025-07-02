import React from 'react';
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
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function FinanceModuleSidebar() {
  const menuItems = [
    {
      title: "Vue d'ensemble",
      icon: BarChart3,
      items: [
        { name: "Tableau de bord", path: "/finance", icon: PieChart },
        { name: "Indicateurs clés", path: "/finance/dashboard", icon: TrendingUp }
      ]
    },
    {
      title: "Comptes étudiants",
      icon: Users,
      items: [
        { name: "Liste des comptes", path: "/finance/accounts", icon: Wallet },
        { name: "Facturation", path: "/finance/billing", icon: FileText },
        { name: "Historique paiements", path: "/finance/payments", icon: Receipt }
      ]
    },
    {
      title: "Facturation",
      icon: FileText,
      items: [
        { name: "Factures", path: "/finance/invoices", icon: FileText },
        { name: "Modèles", path: "/finance/templates", icon: FileText },
        { name: "Échéanciers", path: "/finance/schedules", icon: Calendar }
      ]
    },
    {
      title: "Paiements",
      icon: CreditCard,
      items: [
        { name: "Tous les paiements", path: "/finance/all-payments", icon: CreditCard },
        { name: "Méthodes de paiement", path: "/finance/payment-methods", icon: Wallet },
        { name: "Rapprochement", path: "/finance/reconciliation", icon: Calculator }
      ]
    },
    {
      title: "Bourses & Aides",
      icon: Award,
      items: [
        { name: "Programmes de bourses", path: "/finance/scholarships", icon: Award },
        { name: "Demandes d'aide", path: "/finance/financial-aid", icon: Users },
        { name: "Attributions", path: "/finance/awards", icon: Award }
      ]
    },
    {
      title: "Budgets",
      icon: Calculator,
      items: [
        { name: "Vue d'ensemble", path: "/finance/budget-overview", icon: PieChart },
        { name: "Planification", path: "/finance/budget-planning", icon: TrendingUp },
        { name: "Suivi", path: "/finance/budget-tracking", icon: BarChart3 }
      ]
    },
    {
      title: "Rapports",
      icon: BarChart3,
      items: [
        { name: "Rapports financiers", path: "/finance/reports", icon: BarChart3 },
        { name: "Flux de trésorerie", path: "/finance/cash-flow", icon: TrendingUp },
        { name: "Analytics", path: "/finance/analytics", icon: PieChart }
      ]
    },
    {
      title: "Configuration",
      icon: Settings,
      items: [
        { name: "Catégories", path: "/finance/categories", icon: Settings },
        { name: "Paramètres fiscaux", path: "/finance/tax-settings", icon: Calculator },
        { name: "Années fiscales", path: "/finance/fiscal-years", icon: Calendar }
      ]
    }
  ];

  return (
    <div className="w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border p-4 space-y-6 overflow-y-auto">
      {/* Header du module */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[rgb(245,158,11)] rounded-lg">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-sidebar-foreground">Finance</h2>
          <p className="text-xs text-sidebar-foreground/70">Gestion financière</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-4">
        {menuItems.map((section, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2 text-sidebar-foreground/80 text-sm font-medium">
              <section.icon className="w-4 h-4" />
              <span>{section.title}</span>
            </div>
            <div className="space-y-1 ml-6">
              {section.items.map((item, itemIndex) => (
                <a
                  key={itemIndex}
                  href={item.path}
                  className="flex items-center gap-2 p-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Statistics card */}
      <Card className="bg-sidebar-accent/20 border-sidebar-border/20">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sidebar-foreground/70">Revenus du mois</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                +12%
              </Badge>
            </div>
            <div className="text-lg font-bold text-sidebar-foreground">€125,340</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-sidebar-foreground/60">Factures en cours</span>
                <span className="text-sidebar-foreground">23</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-sidebar-foreground/60">Paiements en attente</span>
                <span className="text-sidebar-foreground">8</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}