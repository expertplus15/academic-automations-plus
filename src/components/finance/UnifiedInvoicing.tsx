import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinanceData } from '@/hooks/useFinanceData';
import { EnhancedInvoiceForm } from '@/components/finance/EnhancedInvoiceForm';
import { FreeInvoiceForm } from '@/components/finance/FreeInvoiceForm';
import { ValidateInvoiceModal } from '@/components/finance/ValidateInvoiceModal';
import { RecordPaymentModal } from '@/components/finance/RecordPaymentModal';
import { useToast } from '@/hooks/use-toast';
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
  AlertTriangle,
  Users,
  Plus,
  Receipt
} from 'lucide-react';

export function UnifiedInvoicing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentInvoiceForm, setShowStudentInvoiceForm] = useState(false);
  const [showCommercialInvoiceForm, setShowCommercialInvoiceForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { invoices, loading, fetchInvoices } = useFinanceData();
  const { toast } = useToast();

  const handleQuoteCreation = () => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La création de devis sera disponible dans une prochaine version",
      variant: "destructive"
    });
  };

  const handleValidateInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowValidateModal(true);
  };

  const handleRecordPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.student?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'students') return matchesSearch && invoice.invoice_type === 'student';
    if (activeTab === 'commercial') return matchesSearch && invoice.invoice_type === 'commercial';
    
    return matchesSearch;
  });

  const invoiceCard = (invoice: any, index: number) => (
    <div
      key={index}
      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[hsl(var(--primary))]/10 rounded-xl">
          <FileText className="w-5 h-5 text-[hsl(var(--primary))]" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-foreground">{invoice.invoice_number}</p>
            {getStatusBadge(invoice.status)}
            {invoice.invoice_type === 'commercial' && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Commercial
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {invoice.invoice_type === 'student' ? 
              invoice.student?.profile?.full_name : 
              invoice.recipient_name
            }
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
            <Button 
              size="sm" 
              className="gap-1"
              onClick={() => handleValidateInvoice(invoice)}
            >
              <Send className="w-3 h-3" />
              Valider & Envoyer
            </Button>
          </>
        )}
        {(invoice.status === 'sent' || invoice.status === 'pending' || invoice.status === 'partial') && (
          <Button 
            size="sm" 
            className="gap-1 bg-green-600 hover:bg-green-700"
            onClick={() => handleRecordPayment(invoice)}
          >
            <DollarSign className="w-3 h-3" />
            Enregistrer Paiement
          </Button>
        )}
        {invoice.status === 'overdue' && (
          <>
            <Button 
              size="sm" 
              className="gap-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleRecordPayment(invoice)}
            >
              <DollarSign className="w-3 h-3" />
              Enregistrer Paiement
            </Button>
            <Button size="sm" variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              Relancer
            </Button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <EnhancedInvoiceForm 
        open={showStudentInvoiceForm} 
        onOpenChange={setShowStudentInvoiceForm}
        onSuccess={fetchInvoices}
      />

      <FreeInvoiceForm 
        open={showCommercialInvoiceForm} 
        onOpenChange={setShowCommercialInvoiceForm}
        onSuccess={fetchInvoices}
      />

      <ValidateInvoiceModal
        open={showValidateModal}
        onOpenChange={setShowValidateModal}
        invoice={selectedInvoice}
        onSuccess={fetchInvoices}
      />

      <RecordPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        invoice={selectedInvoice}
        onSuccess={fetchInvoices}
      />

      {/* Actions principales */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowStudentInvoiceForm(true)}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Facture Étudiant
              </Button>
              <Button 
                onClick={() => setShowCommercialInvoiceForm(true)}
                variant="outline"
                className="gap-2"
              >
                <Receipt className="w-4 h-4" />
                Facture Commerciale (Libre)
              </Button>
              <Button 
                onClick={handleQuoteCreation}
                variant="outline"
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Devis
              </Button>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Période
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets de navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="gap-2">
            <FileText className="w-4 h-4" />
            Toutes
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-2">
            <Users className="w-4 h-4" />
            Étudiants
          </TabsTrigger>
          <TabsTrigger value="commercial" className="gap-2">
            <Receipt className="w-4 h-4" />
            Commerciales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[hsl(var(--primary))]" />
                Toutes les factures ({filteredInvoices.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice, index) => invoiceCard(invoice, index))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[hsl(var(--primary))]" />
                Factures étudiants ({filteredInvoices.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice, index) => invoiceCard(invoice, index))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[hsl(var(--primary))]" />
                Factures commerciales ({filteredInvoices.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice, index) => invoiceCard(invoice, index))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions en lot */}
      <Card>
        <CardHeader>
          <CardTitle>Actions en lot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              Envoyer en lot
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Relances automatiques
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Rapport détaillé
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}