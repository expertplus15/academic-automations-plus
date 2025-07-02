import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FinanceStats {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  invoicesCount: number;
  paymentsCount: number;
  averagePaymentTime: number;
  collectionRate: number;
}

export function useFinanceStats() {
  const [stats, setStats] = useState<FinanceStats>({
    totalRevenue: 0,
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    invoicesCount: 0,
    paymentsCount: 0,
    averagePaymentTime: 0,
    collectionRate: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Récupérer les statistiques des factures
      const { data: invoiceStats } = await supabase
        .from('invoices')
        .select('total_amount, paid_amount, status, issue_date, due_date')
        .gte('issue_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      // Récupérer les statistiques des paiements
      const { data: paymentStats } = await supabase
        .from('payments')
        .select('amount, status, payment_date')
        .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (invoiceStats && paymentStats) {
        const totalRevenue = invoiceStats.reduce((sum, invoice) => sum + invoice.total_amount, 0);
        const totalPaid = invoiceStats.reduce((sum, invoice) => sum + (invoice.paid_amount || 0), 0);
        const totalPending = invoiceStats
          .filter(inv => inv.status === 'pending')
          .reduce((sum, invoice) => sum + (invoice.total_amount - (invoice.paid_amount || 0)), 0);
        const totalOverdue = invoiceStats
          .filter(inv => inv.status === 'overdue')
          .reduce((sum, invoice) => sum + (invoice.total_amount - (invoice.paid_amount || 0)), 0);

        const invoicesCount = invoiceStats.length;
        const paymentsCount = paymentStats.filter(p => p.status === 'completed').length;
        
        // Calcul du taux de recouvrement
        const collectionRate = totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0;

        // Calcul du délai moyen de paiement (simplifié)
        const paidInvoices = invoiceStats.filter(inv => inv.paid_amount >= inv.total_amount);
        const averagePaymentTime = paidInvoices.length > 0 
          ? paidInvoices.reduce((sum, inv) => {
              const daysDiff = Math.floor(
                (new Date(inv.due_date).getTime() - new Date(inv.issue_date).getTime()) / (1000 * 60 * 60 * 24)
              );
              return sum + daysDiff;
            }, 0) / paidInvoices.length
          : 0;

        setStats({
          totalRevenue,
          totalPaid,
          totalPending,
          totalOverdue,
          invoicesCount,
          paymentsCount,
          averagePaymentTime,
          collectionRate,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    fetchStats,
  };
}