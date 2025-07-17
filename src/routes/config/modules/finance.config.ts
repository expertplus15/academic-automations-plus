import { RouteConfig } from '../base.config';

export const financeRoutes: RouteConfig = {
  path: "/finance",
  component: "Finance",
  title: "Finances",
  icon: "Euro",
  protected: true,
  children: [
    {
      path: "/finance/dashboard",
      component: "FinanceDashboard",
      title: "Tableau de bord",
    },
    {
      path: "/finance/invoices",
      component: "FinanceInvoices", 
      title: "Facturation",
    },
    {
      path: "/finance/payments",
      component: "FinancePayments",
      title: "Paiements",
    },
    {
      path: "/finance/budgets",
      component: "FinanceBudgetOverview",
      title: "Budgets",
    },
    {
      path: "/finance/reports",
      component: "FinanceReports",
      title: "Rapports",
    },
    {
      path: "/finance/analytics",
      component: "FinanceAnalytics",
      title: "Analytics",
    },
    {
      path: "/finance/commercial",
      component: "FinanceCommercial",
      title: "Commercial",
    },
    {
      path: "/finance/config",
      component: "FinanceConfig",
      title: "Configuration",
    },
  ],
};