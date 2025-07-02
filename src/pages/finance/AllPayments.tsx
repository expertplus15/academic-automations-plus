import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFinanceData } from '@/hooks/useFinanceData';
import { 
  Search, 
  Filter, 
  CreditCard, 
  Eye, 
  Download,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react';

export default function AllPayments() {
  const [searchTerm, setSearchTerm] = useState('');
  const { payments, loading } = useFinanceData();

  // Données mockées étendues pour cette vue consolidée
  const allPayments = [
    ...payments,
    {
      id: 'pay-ext-001',
      student: { profile: { full_name: 'Alice Dupont' }, student_number: 'ETU240005' },
      amount: 1200,
      payment_date: '2024-01-10',
      payment_method: { name: 'Virement bancaire' },
      status: 'completed',
      transaction_reference: 'WIRE-240110-001',
      payment_number: 'PAY24001',
      notes: 'Paiement frais inscription S1'
    },
    {
      id: 'pay-ext-002',
      student: { profile: { full_name: 'Bob Martin' }, student_number: 'ETU240006' },
      amount: 850,
      payment_date: '2024-01-12',
      payment_method: { name: 'Carte bancaire' },
      status: 'completed',
      transaction_reference: 'CARD-240112-002',
      payment_number: 'PAY24002',
      notes: 'Paiement matériel pédagogique'
    }
  ];

  const stats = [
    {
      label: "Total encaissé",
      value: `€${allPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      change: "+15.3%",
      changeType: "positive" as const
    },
    {
      label: "Paiements ce mois",
      value: allPayments.length.toString(),
      change: "+8",
      changeType: "positive" as const
    },
    {
      label: "Paiements en ligne",
      value: allPayments.filter(p => p.payment_method.name.includes('Carte') || p.payment_method.name.includes('PayPal')).length.toString(),
      change: "+45%",
      changeType: "positive" as const
    },
    {
      label: "Montant moyen",
      value: `€${Math.round(allPayments.reduce((sum, p) => sum + p.amount, 0) / allPayments.length).toLocaleString()}`,
      change: "+12%",
      changeType: "positive" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      refunded: "bg-blue-100 text-blue-700 border-blue-200"
    };

    const labels = {
      completed: "Complété",
      pending: "En attente",
      failed: "Échoué",
      refunded: "Remboursé"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    if (method.includes('Carte') || method.includes('PayPal')) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">En ligne</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Physique</Badge>;
  };

  const filteredPayments = allPayments.filter(payment =>
    payment.student.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.student.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          title="Tous les paiements"
          subtitle="Vue consolidée de tous les paiements reçus"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, numéro étudiant, référence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Statut
                </Button>
                <Button variant="outline" className="gap-2">
                  <CreditCard className="w-4 h-4" />
                  Méthode
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Période
                </Button>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Actualiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des paiements */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[rgb(245,158,11)]" />
              Historique des paiements ({filteredPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <CreditCard className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{payment.payment_number}</p>
                        {getStatusBadge(payment.status)}
                        {getPaymentMethodBadge(payment.payment_method.name)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.student.profile.full_name} • {payment.student.student_number}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Méthode: {payment.payment_method.name}</span>
                        <span>Date: {new Date(payment.payment_date).toLocaleDateString('fr-FR')}</span>
                        {payment.transaction_reference && (
                          <span>Réf: {payment.transaction_reference}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground text-lg">
                        €{payment.amount.toLocaleString()}
                      </span>
                    </div>
                    {payment.notes && (
                      <p className="text-xs text-muted-foreground max-w-48 truncate">
                        {payment.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Détails
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="w-3 h-3" />
                      Reçu
                    </Button>
                    {payment.status === 'completed' && (
                      <Button size="sm" variant="outline" className="gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Rembourser
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Réconciliation bancaire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Rapprocher les paiements avec les relevés bancaires
              </p>
              <Button className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Démarrer réconciliation
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Export des données</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Exporter l'historique des paiements
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Exporter Excel
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Analyse des tendances</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualiser les tendances de paiement
              </p>
              <Button variant="outline" className="w-full gap-2">
                <DollarSign className="w-4 h-4" />
                Voir analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}