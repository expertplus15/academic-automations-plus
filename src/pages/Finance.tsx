import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useFinanceStats } from '@/hooks/useFinanceStats';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';

export default function Finance() {
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const { invoices, loading: dataLoading } = useFinanceData();
  const { stats: financeStats, loading: statsLoading } = useFinanceStats();

  // Check permissions for different actions
  const canCreateInvoices = hasRole(['admin', 'finance', 'hr']);
  const canRecordPayments = hasRole(['admin', 'finance']);
  const canManageScholarships = hasRole(['admin', 'finance']);

  const handleCreateInvoice = () => {
    if (!canCreateInvoices) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour créer une facture",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Créer une facture",
      description: "Interface de création de facture ouverte",
    });
  };

  const handleRecordPayment = () => {
    if (!canRecordPayments) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour enregistrer un paiement",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Enregistrer un paiement",
      description: "Interface de saisie de paiement ouverte",
    });
  };

  const handleManageScholarships = () => {
    if (!canManageScholarships) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour gérer les bourses",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Gestion des bourses",
      description: "Interface de gestion des bourses ouverte",
    });
  };

  // Transform real data for the header component
  const headerStats = [
    {
      label: "Revenus du mois",
      value: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(financeStats.totalRevenue),
      change: financeStats.totalRevenue > 0 ? "Données réelles" : "Aucun revenu",
      changeType: financeStats.totalRevenue > 0 ? "positive" as const : "neutral" as const
    },
    {
      label: "Factures en attente",
      value: financeStats.invoicesCount.toString(),
      change: financeStats.invoicesCount > 0 ? `${financeStats.invoicesCount} factures` : "Aucune facture",
      changeType: financeStats.invoicesCount > 0 ? "neutral" as const : "positive" as const
    },
    {
      label: "Taux de recouvrement",
      value: `${financeStats.collectionRate.toFixed(1)}%`,
      change: financeStats.collectionRate > 80 ? "Bon taux" : "À améliorer",
      changeType: financeStats.collectionRate > 80 ? "positive" as const : "negative" as const
    },
    {
      label: "Total payé",
      value: new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(financeStats.totalPaid),
      change: financeStats.totalPaid > 0 ? "Paiements reçus" : "Aucun paiement",
      changeType: financeStats.totalPaid > 0 ? "positive" as const : "neutral" as const
    }
  ];

  // Transform real invoices data
  const recentInvoices = invoices.slice(0, 3).map(invoice => ({
    id: invoice.invoice_number,
    student: invoice.student?.profile?.full_name || invoice.recipient_name || 'N/A',
    amount: new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(invoice.total_amount),
    status: invoice.status,
    dueDate: new Date(invoice.due_date).toLocaleDateString('fr-FR')
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Payée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />En retard</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'finance', 'hr']}>
      <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        {statsLoading || dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Chargement des données financières...</span>
          </div>
        ) : (
          <>
            <FinancePageHeader
              title="Finance"
              subtitle="Gestion financière et comptabilité"
              stats={headerStats}
              showCreateButton={false}
              showExportButton={true}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Graphiques de revenus */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-finance" />
                      Évolution des revenus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Graphique des revenus à venir</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Factures récentes */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-finance" />
                      Factures récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentInvoices.length > 0 ? (
                      <div className="space-y-4">
                        {recentInvoices.map((invoice, index) => (
                          <div
                            key={invoice.id || index}
                            className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-finance/10 rounded-lg">
                                <FileText className="w-4 h-4 text-finance" />
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
                                <span className="text-xs text-muted-foreground">
                                  Échéance: {invoice.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
                        <p className="text-muted-foreground">Aucune facture récente</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Colonne latérale */}
              <div className="space-y-6">
                {/* Actions rapides */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {canCreateInvoices && (
                      <button 
                        className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                        onClick={handleCreateInvoice}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-finance" />
                          <div>
                            <p className="font-medium">Créer une facture</p>
                            <p className="text-xs text-muted-foreground">Facturer un étudiant</p>
                          </div>
                        </div>
                      </button>
                    )}
                    
                    {canRecordPayments && (
                      <button 
                        className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                        onClick={handleRecordPayment}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-finance" />
                          <div>
                            <p className="font-medium">Enregistrer un paiement</p>
                            <p className="text-xs text-muted-foreground">Saisie manuelle</p>
                          </div>
                        </div>
                      </button>
                    )}

                    {canManageScholarships && (
                      <button 
                        className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                        onClick={handleManageScholarships}
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-finance" />
                          <div>
                            <p className="font-medium">Gestion des bourses</p>
                            <p className="text-xs text-muted-foreground">Attribuer une bourse</p>
                          </div>
                        </div>
                      </button>
                    )}
                  </CardContent>
                </Card>

                {/* Alertes dynamiques */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
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
                      <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-700">
                          {new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: 'EUR' 
                          }).format(financeStats.totalPending)} en attente
                        </p>
                        <p className="text-xs text-yellow-600">Paiements attendus</p>
                      </div>
                    )}

                    {financeStats.collectionRate < 80 && financeStats.totalRevenue > 0 && (
                      <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                        <p className="text-sm font-medium text-orange-700">
                          Taux de recouvrement bas: {financeStats.collectionRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-orange-600">Actions de recouvrement nécessaires</p>
                      </div>
                    )}

                    {financeStats.totalRevenue === 0 && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm font-medium text-blue-700">Système initialisé</p>
                        <p className="text-xs text-blue-600">Prêt pour la gestion financière</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}