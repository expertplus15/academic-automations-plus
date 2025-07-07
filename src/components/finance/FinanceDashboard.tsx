import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  TrendingUp, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  Calculator
} from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useFinanceStats } from '@/hooks/useFinanceStats';
import { FinanceCharts } from './FinanceCharts';
import { FinanceAnalytics } from './FinanceAnalytics';

interface FinanceDashboardProps {
  className?: string;
}

export function FinanceDashboard({ className }: FinanceDashboardProps) {
  const { invoices, loading: dataLoading } = useFinanceData();
  const { stats: financeStats, loading: statsLoading, error } = useFinanceStats();

  // Status badge renderer avec design system
  const getStatusBadge = (status: string) => {
    const variants = {
      paid: { className: "bg-success/10 text-success border-success/20", icon: CheckCircle, label: "Payée" },
      pending: { className: "bg-warning/10 text-warning border-warning/20", icon: Clock, label: "En attente" },
      overdue: { className: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle, label: "En retard" },
      draft: { className: "bg-muted/50 text-muted-foreground border-muted/20", icon: FileText, label: "Brouillon" }
    };
    
    const variant = variants[status as keyof typeof variants] || variants.draft;
    const Icon = variant.icon;
    
    return (
      <Badge className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  // Transform recent invoices with better data handling
  const recentInvoices = React.useMemo(() => {
    return invoices.slice(0, 5).map(invoice => ({
      id: invoice.invoice_number,
      student: invoice.student?.profile?.full_name || invoice.recipient_name || 'Client non spécifié',
      amount: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(invoice.total_amount),
      status: invoice.status,
      dueDate: new Date(invoice.due_date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      isOverdue: new Date(invoice.due_date) < new Date() && invoice.status !== 'paid'
    }));
  }, [invoices]);

  // Loading skeleton
  if (dataLoading || statsLoading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Métriques rapides */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-finance" />
                <span className="text-xs font-medium text-muted-foreground">Total Revenue</span>
              </div>
              <p className="text-lg font-bold text-foreground mt-1">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR',
                  notation: 'compact'
                }).format(financeStats.totalRevenue)}
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-xs font-medium text-muted-foreground">Payé</span>
              </div>
              <p className="text-lg font-bold text-foreground mt-1">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR',
                  notation: 'compact'
                }).format(financeStats.totalPaid)}
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-xs font-medium text-muted-foreground">En attente</span>
              </div>
              <p className="text-lg font-bold text-foreground mt-1">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR',
                  notation: 'compact'
                }).format(financeStats.totalPending)}
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Taux</span>
              </div>
              <p className="text-lg font-bold text-foreground mt-1">
                {financeStats.collectionRate.toFixed(1)}%
              </p>
            </Card>
          </div>

          {/* Graphiques intelligents */}
          <FinanceCharts
            revenueData={financeStats.monthlyData}
            paymentStatusData={financeStats.statusData}
            trendData={financeStats.trendData}
            loading={statsLoading}
          />

          {/* Analytics avancés */}
          <FinanceAnalytics
            data={{
              monthlyGrowth: financeStats.monthlyGrowth,
              collectionEfficiency: financeStats.collectionEfficiency,
              cashFlowHealth: financeStats.cashFlowHealth,
              predictions: {
                nextMonthRevenue: financeStats.totalRevenue * 1.1,
                collectionRisk: Math.max(0, 100 - financeStats.collectionRate),
                optimalCashFlow: financeStats.totalRevenue * 1.2
              },
              kpis: {
                dso: financeStats.dso,
                conversionRate: financeStats.conversionRate,
                customerLifetimeValue: 2500,
                churnRate: 3.2
              }
            }}
            loading={statsLoading}
          />

          {/* Factures récentes */}
          <Card className="bg-card rounded-xl border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-finance" />
                Factures récentes
                {recentInvoices.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {recentInvoices.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentInvoices.length > 0 ? (
                <div className="space-y-4">
                  {recentInvoices.map((invoice, index) => (
                    <div
                      key={invoice.id || index}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-accent/50 ${
                        invoice.isOverdue ? 'border-destructive/30 bg-destructive/5' : 'border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          invoice.isOverdue ? 'bg-destructive/10' : 'bg-finance/10'
                        }`}>
                          <FileText className={`w-4 h-4 ${
                            invoice.isOverdue ? 'text-destructive' : 'text-finance'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{invoice.id}</p>
                          <p className="text-sm text-muted-foreground">{invoice.student}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-foreground">{invoice.amount}</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(invoice.status)}
                          <span className={`text-xs ${
                            invoice.isOverdue ? 'text-destructive' : 'text-muted-foreground'
                          }`}>
                            {invoice.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">Aucune facture récente</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Les factures apparaîtront ici une fois créées
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale - Alertes et indicateurs */}
        <div className="space-y-6">
          {/* Indicateurs clés */}
          <Card className="bg-card rounded-xl border-border">
            <CardHeader>
              <CardTitle className="text-lg">Indicateurs clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Factures total</span>
                <span className="font-semibold">{financeStats.invoicesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Paiements reçus</span>
                <span className="font-semibold">{financeStats.paymentsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Délai moyen</span>
                <span className="font-semibold">
                  {financeStats.averagePaymentTime > 0 
                    ? `${Math.round(financeStats.averagePaymentTime)}j`
                    : 'N/A'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Alertes dynamiques */}
          <Card className="bg-card rounded-xl border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {financeStats.totalOverdue > 0 && (
                <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(financeStats.totalOverdue)} en retard
                  </p>
                  <p className="text-xs text-destructive/80">Relances à envoyer</p>
                </div>
              )}
              
              {financeStats.totalPending > 0 && (
                <div className="p-3 bg-warning/10 rounded-xl border border-warning/20">
                  <p className="text-sm font-medium text-warning">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(financeStats.totalPending)} en attente
                  </p>
                  <p className="text-xs text-warning/80">Paiements attendus</p>
                </div>
              )}

              {financeStats.collectionRate < 80 && financeStats.totalRevenue > 0 && (
                <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <p className="text-sm font-medium text-orange-700">
                    Taux bas: {financeStats.collectionRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-orange-600">Actions nécessaires</p>
                </div>
              )}

              {financeStats.totalRevenue === 0 && (
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-sm font-medium text-primary">Système initialisé</p>
                  <p className="text-xs text-primary/80">Prêt pour la gestion financière</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">Erreur de chargement</p>
                  <p className="text-xs text-destructive/80">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}