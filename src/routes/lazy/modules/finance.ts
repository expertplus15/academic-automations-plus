import { lazyLoad } from '../index';

// Pages du module Finance
export const FinanceDashboard = lazyLoad(() => import('@/pages/finance/Dashboard'));
export const FinanceInvoices = lazyLoad(() => import('@/pages/finance/Invoices'));
export const FinancePayments = lazyLoad(() => import('@/pages/finance/Payments'));
export const FinanceBudgetOverview = lazyLoad(() => import('@/pages/finance/BudgetOverview'));
export const FinanceReports = lazyLoad(() => import('@/pages/finance/Reports'));
export const FinanceAnalytics = lazyLoad(() => import('@/pages/finance/Analytics'));
export const FinanceCommercial = lazyLoad(() => import('@/pages/finance/Commercial'));
export const FinanceConfig = lazyLoad(() => import('@/pages/finance/Config'));