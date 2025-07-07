import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les statistiques des factures avec gestion d'erreur améliorée
      const { data: invoiceStats, error: invoiceError } = await supabase
        .from('invoices')
        .select('total_amount, paid_amount, status, issue_date, due_date')
        .gte('issue_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (invoiceError) {
        console.error('Erreur factures:', invoiceError);
        throw new Error('Impossible de charger les factures');
      }

      // Récupérer les statistiques des paiements avec gestion d'erreur améliorée
      const { data: paymentStats, error: paymentError } = await supabase
        .from('payments')
        .select('amount, status, payment_date')
        .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (paymentError) {
        console.error('Erreur paiements:', paymentError);
        throw new Error('Impossible de charger les paiements');
      }

      // Calculs sécurisés avec données par défaut
      const safeInvoiceStats = invoiceStats || [];
      const safePaymentStats = paymentStats || [];

      const totalRevenue = safeInvoiceStats.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
      const totalPaid = safeInvoiceStats.reduce((sum, invoice) => sum + (invoice.paid_amount || 0), 0);
      
      const totalPending = safeInvoiceStats
        .filter(inv => inv.status === 'pending')
        .reduce((sum, invoice) => sum + ((invoice.total_amount || 0) - (invoice.paid_amount || 0)), 0);
      
      const totalOverdue = safeInvoiceStats
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, invoice) => sum + ((invoice.total_amount || 0) - (invoice.paid_amount || 0)), 0);

      const invoicesCount = safeInvoiceStats.length;
      const paymentsCount = safePaymentStats.filter(p => p.status === 'completed').length;
      
      // Calcul sécurisé du taux de recouvrement
      const collectionRate = totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0;

      // Calcul sécurisé du délai moyen de paiement
      const paidInvoices = safeInvoiceStats.filter(inv => (inv.paid_amount || 0) >= (inv.total_amount || 0));
      const averagePaymentTime = paidInvoices.length > 0 
        ? paidInvoices.reduce((sum, inv) => {
            try {
              const daysDiff = Math.floor(
                (new Date(inv.due_date).getTime() - new Date(inv.issue_date).getTime()) / (1000 * 60 * 60 * 24)
              );
              return sum + (isNaN(daysDiff) ? 0 : daysDiff);
            } catch {
              return sum;
            }
          }, 0) / paidInvoices.length
        : 0;

      setStats({
        totalRevenue: Math.max(0, totalRevenue),
        totalPaid: Math.max(0, totalPaid),
        totalPending: Math.max(0, totalPending),
        totalOverdue: Math.max(0, totalOverdue),
        invoicesCount: Math.max(0, invoicesCount),
        paymentsCount: Math.max(0, paymentsCount),
        averagePaymentTime: Math.max(0, averagePaymentTime),
        collectionRate: Math.min(100, Math.max(0, collectionRate)),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques';
      console.error('Erreur lors du chargement des statistiques:', error);
      setError(errorMessage);
      
      // Toast d'erreur seulement si ce n'est pas un problème de données vides
      if (!errorMessage.includes('Impossible de charger')) {
        toast({
          title: "Erreur de chargement",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    refetch: fetchStats, // Alias pour compatibilité
  };
}