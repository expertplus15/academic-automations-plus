import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStats } from '@/hooks/useFinanceStats';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  CreditCard,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const { stats, loading } = useFinanceStats();

  const dashboardStats = [
    {
      label: "Revenus totaux",
      value: `€${stats.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      changeType: "positive" as const
    },
    {
      label: "Montant encaissé",
      value: `€${stats.totalPaid.toLocaleString()}`,
      change: "+8.3%",
      changeType: "positive" as const
    },
    {
      label: "En attente",
      value: `€${stats.totalPending.toLocaleString()}`,
      change: "-5.2%",
      changeType: "positive" as const
    },
    {
      label: "Taux de recouvrement",
      value: `${stats.collectionRate.toFixed(1)}%`,
      change: "+2.1%",
      changeType: "positive" as const
    }
  ];

  if (loading) {
    return (
      <ModuleLayout sidebar={<FinanceModuleSidebar />}>
        <div className="p-8">
          <div className="text-center">Chargement...</div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Tableau de bord financier"
          subtitle="Vue d'ensemble des indicateurs financiers"
          stats={dashboardStats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={false}
        />

        {/* Indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Factures émises</p>
                  <p className="text-2xl font-bold text-foreground">{stats.invoicesCount}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+8 ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paiements reçus</p>
                  <p className="text-2xl font-bold text-foreground">{stats.paymentsCount}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+15% vs. mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Délai moyen de paiement</p>
                  <p className="text-2xl font-bold text-foreground">{stats.averagePaymentTime.toFixed(0)} jours</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">-2 jours</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Factures en retard</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round(stats.totalOverdue)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Attention requise</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Évolution des revenus */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[rgb(245,158,11)]" />
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

          {/* Répartition des paiements */}
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[rgb(245,158,11)]" />
                Répartition des paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Payées</span>
                  </div>
                  <span className="font-semibold">€{stats.totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">En attente</span>
                  </div>
                  <span className="font-semibold">€{stats.totalPending.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">En retard</span>
                  </div>
                  <span className="font-semibold">€{stats.totalOverdue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertes et actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-red-50 rounded-2xl shadow-sm border border-red-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Factures en retard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-700 mb-2">{Math.round(stats.totalOverdue / 1000)}k€</p>
              <p className="text-sm text-red-600 mb-4">
                Nécessitent une action immédiate
              </p>
              <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Envoyer relances
              </button>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
                <Clock className="w-5 h-5" />
                Paiements attendus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-700 mb-2">{Math.round(stats.totalPending / 1000)}k€</p>
              <p className="text-sm text-yellow-600 mb-4">
                Factures en cours de traitement
              </p>
              <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                Suivre paiements
              </button>
            </CardContent>
          </Card>

          <Card className="bg-green-50 rounded-2xl shadow-sm border border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700 mb-2">{stats.collectionRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600 mb-4">
                Taux de recouvrement
              </p>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Voir détails
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}