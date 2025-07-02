import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFinanceData } from '@/hooks/useFinanceData';
import { InvoiceForm } from '@/components/finance/InvoiceForm';
import { 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Edit,
  Send,
  Download,
  Calendar,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const { invoices, loading, fetchInvoices } = useFinanceData();

  const stats = [
    {
      label: "Total facturé",
      value: `€${invoices.reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}`,
      change: "+12.3%",
      changeType: "positive" as const
    },
    {
      label: "Factures émises",
      value: invoices.length.toString(),
      change: "+8",
      changeType: "positive" as const
    },
    {
      label: "En attente de paiement",
      value: invoices.filter(inv => inv.status === 'pending').length.toString(),
      change: "-3",
      changeType: "positive" as const
    },
    {
      label: "En retard",
      value: invoices.filter(inv => inv.status === 'overdue').length.toString(),
      change: "+2",
      changeType: "negative" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "bg-gray-100 text-gray-700 border-gray-200",
      sent: "bg-blue-100 text-blue-700 border-blue-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      partial: "bg-orange-100 text-orange-700 border-orange-200",
      paid: "bg-green-100 text-green-700 border-green-200",
      overdue: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-red-100 text-red-700 border-red-200"
    };

    const labels = {
      draft: "Brouillon",
      sent: "Envoyée",
      pending: "En attente",
      partial: "Partiellement payée",
      paid: "Payée",
      overdue: "En retard",
      cancelled: "Annulée"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.student.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
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
          title="Factures"
          subtitle="Gestion des factures et émissions"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle facture"
          showExportButton={true}
          onCreateClick={() => setShowInvoiceForm(true)}
        />

        <InvoiceForm 
          open={showInvoiceForm} 
          onOpenChange={setShowInvoiceForm}
          onSuccess={fetchInvoices}
        />

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, numéro de facture..."
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
                  <Calendar className="w-4 h-4" />
                  Date
                </Button>
                <Button variant="outline" className="gap-2">
                  <DollarSign className="w-4 h-4" />
                  Montant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des factures */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
              Factures ({filteredInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.map((invoice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{invoice.invoice_number}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.student.profile.full_name}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Émise: {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}</span>
                        <span>Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-semibold text-foreground text-lg">
                        €{invoice.total_amount.toLocaleString()}
                      </span>
                    </div>
                    {invoice.paid_amount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Payé: €{invoice.paid_amount.toLocaleString()}
                      </p>
                    )}
                    {invoice.tax_amount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Dont TVA: €{invoice.tax_amount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="w-3 h-3" />
                      PDF
                    </Button>
                    {invoice.status === 'draft' && (
                      <>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Edit className="w-3 h-3" />
                          Éditer
                        </Button>
                        <Button size="sm" className="gap-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                          <Send className="w-3 h-3" />
                          Envoyer
                        </Button>
                      </>
                    )}
                    {invoice.status === 'overdue' && (
                      <Button size="sm" className="gap-1 bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="w-3 h-3" />
                        Relancer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions en lot */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle>Actions en lot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="gap-2 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                <Send className="w-4 h-4" />
                Envoyer en lot
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                Relances
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Rapport
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}