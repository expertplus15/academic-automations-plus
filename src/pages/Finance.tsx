import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Finance() {
  const { toast } = useToast();

  const handleCreateInvoice = () => {
    toast({
      title: "Créer une facture",
      description: "Interface de création de facture ouverte",
    });
  };

  const handleRecordPayment = () => {
    toast({
      title: "Enregistrer un paiement",
      description: "Interface de saisie de paiement ouverte",
    });
  };

  const handleManageScholarships = () => {
    toast({
      title: "Gestion des bourses",
      description: "Interface de gestion des bourses ouverte",
    });
  };

  const stats = [
    {
      label: "Revenus du mois",
      value: "€125,340",
      change: "+12.5%",
      changeType: "positive" as const
    },
    {
      label: "Factures en attente",
      value: "23",
      change: "-5%",
      changeType: "positive" as const
    },
    {
      label: "Taux de recouvrement",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive" as const
    },
    {
      label: "Bourses attribuées",
      value: "€45,600",
      change: "+8.3%",
      changeType: "positive" as const
    }
  ];

  const recentInvoices = [
    {
      id: "FAC-2024-001",
      student: "Marie Dubois",
      amount: "€2,500",
      status: "paid",
      dueDate: "2024-01-15"
    },
    {
      id: "FAC-2024-002",
      student: "Jean Martin",
      amount: "€2,800",
      status: "pending",
      dueDate: "2024-01-20"
    },
    {
      id: "FAC-2024-003",
      student: "Sophie Laurent",
      amount: "€2,300",
      status: "overdue",
      dueDate: "2024-01-10"
    }
  ];

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
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Finance"
          subtitle="Gestion financière et comptabilité"
          stats={stats}
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

            {/* Factures récentes */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
                  Factures récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvoices.map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[rgb(245,158,11)]/10 rounded-lg">
                          <FileText className="w-4 h-4 text-[rgb(245,158,11)]" />
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
                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={handleCreateInvoice}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
                    <div>
                      <p className="font-medium">Créer une facture</p>
                      <p className="text-xs text-muted-foreground">Facturer un étudiant</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={handleRecordPayment}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[rgb(245,158,11)]" />
                    <div>
                      <p className="font-medium">Enregistrer un paiement</p>
                      <p className="text-xs text-muted-foreground">Saisie manuelle</p>
                    </div>
                  </div>
                </button>

                <button 
                  className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  onClick={handleManageScholarships}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[rgb(245,158,11)]" />
                    <div>
                      <p className="font-medium">Gestion des bourses</p>
                      <p className="text-xs text-muted-foreground">Attribuer une bourse</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Alertes */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-sm font-medium text-red-700">8 factures en retard</p>
                  <p className="text-xs text-red-600">Relances à envoyer</p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-700">Rapprochement bancaire</p>
                  <p className="text-xs text-yellow-600">En attente depuis 3 jours</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">23 demandes de bourse</p>
                  <p className="text-xs text-blue-600">À examiner</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}