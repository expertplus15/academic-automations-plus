import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function FinanceModuleSidebar() {
  const location = useLocation();
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
      title: "Gestion opérationnelle",
      icon: Users,
      items: [
        { name: "Comptes étudiants", path: "/finance/accounts", icon: Wallet },
        { name: "Facturation", path: "/finance/invoices", icon: FileText },
        { name: "Gestion des paiements", path: "/finance/payments", icon: CreditCard },
        { name: "Dépenses", path: "/finance/expenses", icon: Receipt }
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
      title: "Analyse & Rapports",
      icon: BarChart3,
      items: [
        { name: "Historique des paiements", path: "/finance/payment-history", icon: Receipt },
        { name: "Rapports financiers", path: "/finance/reports", icon: BarChart3 },
        { name: "Flux de trésorerie", path: "/finance/cash-flow", icon: TrendingUp },
        { name: "Analytics", path: "/finance/analytics", icon: PieChart }
      ]
    },
    {
      title: "États financiers",
      icon: BarChart3,
      items: [
        { name: "Bilan comptable", path: "/finance/balance-sheet", icon: PieChart },
        { name: "Compte de résultat", path: "/finance/income-statement", icon: TrendingUp },
        { name: "Flux de trésorerie", path: "/finance/cash-flow", icon: TrendingUp },
        { name: "Ratios financiers", path: "/finance/financial-ratios", icon: Calculator }
      ]
    },
    {
      title: "Configuration",
      icon: Settings,
      items: [
        { name: "Années fiscales", path: "/finance/fiscal-years", icon: Calendar },
        { name: "Catégories", path: "/finance/categories", icon: Settings },
        { name: "Méthodes de paiement", path: "/finance/payment-methods", icon: Wallet },
        { name: "Modèles de factures", path: "/finance/templates", icon: FileText },
        { name: "Échéanciers", path: "/finance/schedules", icon: Calendar },
        { name: "Paramètres fiscaux", path: "/finance/tax-settings", icon: Calculator },
        { name: "Rapprochement", path: "/finance/reconciliation", icon: Calculator }
      ]
    }
  ];

  return (
    <div className="w-64 bg-black text-white border-r border-gray-800 p-4 space-y-6 overflow-y-auto">
      {/* Bouton retour */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Retour au tableau de bord</span>
      </Link>

      {/* Header du module */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[rgb(245,158,11)] rounded-lg">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Finance</h2>
          <p className="text-xs text-gray-300">Gestion financière</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-4">
        {menuItems.map((section, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
              <section.icon className="w-4 h-4" />
              <span>{section.title}</span>
            </div>
            <div className="space-y-1 ml-6">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.path}
                  className={`flex items-center gap-2 p-2 text-sm rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'text-white bg-[rgb(245,158,11)]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Statistics card */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Revenus du mois</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                +12%
              </Badge>
            </div>
            <div className="text-lg font-bold text-white">€125,340</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Factures en cours</span>
                <span className="text-white">23</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Paiements en attente</span>
                <span className="text-white">8</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}