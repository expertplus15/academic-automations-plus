import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy load finance pages
const Finance = React.lazy(() => import('@/pages/Finance'));
const FinanceDashboard = React.lazy(() => import('@/pages/finance/Dashboard'));
const FinanceInvoices = React.lazy(() => import('@/pages/finance/Invoices'));
const FinancePayments = React.lazy(() => import('@/pages/finance/Payments'));
const FinanceBudgetOverview = React.lazy(() => import('@/pages/finance/BudgetOverview'));
const FinanceReports = React.lazy(() => import('@/pages/finance/Reports'));
const FinanceAnalytics = React.lazy(() => import('@/pages/finance/Analytics'));
const FinanceCommercial = React.lazy(() => import('@/pages/finance/Commercial'));
const FinanceConfig = React.lazy(() => import('@/pages/finance/Config'));

export default function FinanceRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'finance']}>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<Finance />} />
          <Route path="dashboard" element={<FinanceDashboard />} />
          <Route path="invoices" element={<FinanceInvoices />} />
          <Route path="payments" element={<FinancePayments />} />
          <Route path="budgets" element={<FinanceBudgetOverview />} />
          <Route path="reports" element={<FinanceReports />} />
          <Route path="analytics" element={<FinanceAnalytics />} />
          <Route path="commercial" element={<FinanceCommercial />} />
          <Route path="config" element={<FinanceConfig />} />
        </Routes>
      </Suspense>
    </ProtectedRoute>
  );
}