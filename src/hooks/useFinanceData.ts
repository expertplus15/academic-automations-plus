// Re-export all finance hooks for backward compatibility
export { useInvoices, type Invoice } from './finance/useInvoices';
export { usePayments, type Payment } from './finance/usePayments';
export { useStudentAccounts, type StudentAccount } from './finance/useStudentAccounts';
export { useFiscalYears, type FiscalYear } from './finance/useFiscalYears';
export { useFinancialCategories, type FinancialCategory } from './finance/useFinancialCategories';
export { useScholarships, type Scholarship } from './finance/useScholarships';
export { useBudgetItems, type BudgetItem } from './finance/useBudgetItems';

import { useInvoices } from './finance/useInvoices';
import { usePayments } from './finance/usePayments';
import { useStudentAccounts } from './finance/useStudentAccounts';
import { useFiscalYears } from './finance/useFiscalYears';
import { useFinancialCategories } from './finance/useFinancialCategories';
import { useScholarships } from './finance/useScholarships';
import { useBudgetItems } from './finance/useBudgetItems';

// Combined hook for all finance data
export function useFinanceData() {
  const invoices = useInvoices();
  const payments = usePayments();
  const accounts = useStudentAccounts();
  const fiscalYears = useFiscalYears();
  const categories = useFinancialCategories();
  const scholarships = useScholarships();
  const budgetItems = useBudgetItems();

  return {
    // Invoices
    invoices: invoices.invoices,
    fetchInvoices: invoices.fetchInvoices,
    createInvoice: invoices.createInvoice,
    
    // Payments
    payments: payments.payments,
    fetchPayments: payments.fetchPayments,
    createPayment: payments.createPayment,
    
    // Accounts
    accounts: accounts.accounts,
    fetchAccounts: accounts.fetchAccounts,
    
    // Fiscal Years
    fiscalYears: fiscalYears.fiscalYears,
    fetchFiscalYears: fiscalYears.fetchFiscalYears,
    createFiscalYear: fiscalYears.createFiscalYear,
    
    // Financial Categories
    financialCategories: categories.categories,
    fetchCategories: categories.fetchCategories,
    createCategory: categories.createCategory,
    
    // Scholarships
    scholarships: scholarships.scholarships,
    fetchScholarships: scholarships.fetchScholarships,
    createScholarship: scholarships.createScholarship,
    
    // Budget Items
    budgetItems: budgetItems.budgetItems,
    fetchBudgetItems: budgetItems.fetchBudgetItems,
    createBudgetItem: budgetItems.createBudgetItem,
    
    // Loading state
    loading: invoices.loading || payments.loading || accounts.loading || 
             fiscalYears.loading || categories.loading || scholarships.loading || budgetItems.loading,
  };
}