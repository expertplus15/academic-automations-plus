// Re-export all finance hooks for backward compatibility
export { useInvoices, type Invoice } from './finance/useInvoices';
export { usePayments, type Payment } from './finance/usePayments';
export { useStudentAccounts, type StudentAccount } from './finance/useStudentAccounts';

import { useInvoices } from './finance/useInvoices';
import { usePayments } from './finance/usePayments';
import { useStudentAccounts } from './finance/useStudentAccounts';

// Combined hook for all finance data
export function useFinanceData() {
  const invoices = useInvoices();
  const payments = usePayments();
  const accounts = useStudentAccounts();

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
    
    // Loading state
    loading: invoices.loading || payments.loading || accounts.loading,
  };
}