import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PaymentForm } from '@/components/finance/PaymentForm';
import { 
  Search, 
  Filter, 
  CreditCard, 
  Check, 
  X,
  Eye,
  RefreshCw,
  Download
} from 'lucide-react';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const payments = [
    {
      id: "PAY-2024-001",
      paymentNumber: "P240001",
      student: "Marie Dubois",
      studentNumber: "ETU240001",
      amount: 2500,
      method: "Carte bancaire",
      status: "completed",
      date: "2024-01-15",
      reference: "TXN_123456789",
      invoiceId: "FAC-2024-001"
    },
    {
      id: "PAY-2024-002",
      paymentNumber: "P240002",
      student: "Jean Martin",
      studentNumber: "ETU240002",
      amount: 1400,
      method: "Virement bancaire",
      status: "pending",
      date: "2024-01-20",
      reference: "VIR_987654321",
      invoiceId: "FAC-2024-002"
    },
    {
      id: "PAY-2024-003",
      paymentNumber: "P240003",
      student: "Sophie Laurent",
      studentNumber: "ETU240003",
      amount: 1000,
      method: "PayPal",
      status: "completed",
      date: "2024-01-18",
      reference: "PP_555666777",
      invoiceId: "FAC-2024-003"
    },
    {
      id: "PAY-2024-004",
      paymentNumber: "P240004",
      student: "Pierre Durand",
      studentNumber: "ETU240004",
      amount: 800,
      method: "Chèque",
      status: "failed",
      date: "2024-01-22",
      reference: "CHK_111222333",
      invoiceId: "FAC-2024-004"
    }
  ];

  const stats = [
    {
      label: "Paiements reçus",
      value: "€89,250",
      change: "+15.3%",
      changeType: "positive" as const
    },
    {
      label: "Transactions",
      value: "156",
      change: "+8%",
      changeType: "positive" as const
    },
    {
      label: "En attente",
      value: "€12,400",
      change: "-10%",
      changeType: "positive" as const
    },
    {
      label: "Taux de succès",
      value: "96.8%",
      change: "+1.2%",
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
      completed: "Validé",
      pending: "En attente",
      failed: "Échoué",
      refunded: "Remboursé"
    };

    const icons = {
      completed: <Check className="w-3 h-3 mr-1" />,
      pending: <RefreshCw className="w-3 h-3 mr-1" />,
      failed: <X className="w-3 h-3 mr-1" />,
      refunded: <RefreshCw className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      "Carte bancaire": "bg-blue-100 text-blue-700 border-blue-200",
      "Virement bancaire": "bg-green-100 text-green-700 border-green-200",
      "PayPal": "bg-purple-100 text-purple-700 border-purple-200",
      "Chèque": "bg-gray-100 text-gray-700 border-gray-200",
      "Espèces": "bg-orange-100 text-orange-700 border-orange-200"
    };

    return (
      <Badge className={colors[method as keyof typeof colors] || colors["Chèque"]}>
        {method}
      </Badge>
    );
  };

  const filteredPayments = payments.filter(payment =>
    payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Paiements"
          subtitle="Suivi et gestion des paiements étudiants"
          stats={stats}
          showCreateButton={true}
          createButtonText="Enregistrer un paiement"
          showExportButton={true}
          onCreateClick={() => setShowPaymentForm(true)}
        />

        <PaymentForm 
          open={showPaymentForm} 
          onOpenChange={setShowPaymentForm}
          onSuccess={() => console.log('Payment created successfully')}
        />

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par étudiant, numéro de paiement..."
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
                  <Download className="w-4 h-4" />
                  Rapprochement
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
              Paiements ({filteredPayments.length})
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
                        <p className="font-semibold text-foreground">{payment.paymentNumber}</p>
                        {getStatusBadge(payment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.student} • {payment.studentNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getMethodBadge(payment.method)}
                        <span className="text-xs text-muted-foreground">
                          Ref: {payment.reference}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-semibold text-foreground text-lg">
                        €{payment.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Facture: {payment.invoiceId}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Détails
                    </Button>
                    {payment.status === 'pending' && (
                      <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                        <Check className="w-3 h-3" />
                        Valider
                      </Button>
                    )}
                    {payment.status === 'failed' && (
                      <Button size="sm" variant="outline" className="gap-1 text-blue-600 border-blue-200">
                        <RefreshCw className="w-3 h-3" />
                        Réessayer
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
              <CardTitle className="text-lg">Rapprochement bancaire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Dernière synchronisation: Il y a 2 heures
              </p>
              <Button className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Synchroniser
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Paiements en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-2">€12,400</p>
              <p className="text-sm text-muted-foreground mb-4">
                8 transactions à valider
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Check className="w-4 h-4" />
                Valider tout
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Générer des rapports de paiements
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <Download className="w-4 h-4" />
                  Export Excel
                </Button>
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <Download className="w-4 h-4" />
                  Rapport PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}