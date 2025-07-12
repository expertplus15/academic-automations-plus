import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Receipt, 
  Plus, 
  FileText, 
  Users,
  Building,
  TrendingUp,
  Calendar,
  Euro
} from 'lucide-react';
import { useCommercialClients } from '@/hooks/finance/useCommercialClients';
import { useCommercialQuotations } from '@/hooks/finance/useCommercialQuotations';
import { useCommercialInvoices } from '@/hooks/finance/useCommercialInvoices';
import { CommercialClientForm } from './forms/CommercialClientForm';
import { QuotationForm } from './forms/QuotationForm';
import { CommercialInvoiceForm } from './forms/CommercialInvoiceForm';

export function CommercialBilling() {
  const { toast } = useToast();
  const [showClientForm, setShowClientForm] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const { clients, loading: clientsLoading } = useCommercialClients();
  const { quotations, loading: quotationsLoading } = useCommercialQuotations();
  const { invoices, loading: invoicesLoading } = useCommercialInvoices();

  const handleNewInvoice = () => {
    setShowInvoiceForm(true);
  };

  const handleNewQuotation = () => {
    setShowQuotationForm(true);
  };

  const handleNewClient = () => {
    setShowClientForm(true);
  };

  const handleViewInvoice = (invoiceNumber: string) => {
    toast({
      title: "Détails de la facture",
      description: `Consultation de la facture ${invoiceNumber}`,
    });
  };

  const handleViewQuotation = (quoteNumber: string) => {
    toast({
      title: "Détails du devis",
      description: `Consultation du devis ${quoteNumber}`,
    });
  };

  const handleViewClient = (clientName: string) => {
    toast({
      title: "Détails du client",
      description: `Consultation du client ${clientName}`,
    });
  };
  const serviceTypes = [
    { name: "Formations Inter-entreprises", revenue: "€85,200", count: 12, growth: "+15%" },
    { name: "Audits & Conseil", revenue: "€124,500", count: 8, growth: "+23%" },
    { name: "Prestations RH", revenue: "€67,800", count: 15, growth: "+8%" },
    { name: "Recherche & Développement", revenue: "€156,000", count: 6, growth: "+31%" }
  ];

  const recentInvoices = invoices.slice(0, 10).map(invoice => {
    const client = clients.find(c => c.id === invoice.client_id);
    return {
      number: invoice.invoice_number,
      client: client?.company_name || 'Client inconnu',
      service: invoice.title,
      amount: `€${invoice.total_amount?.toLocaleString() || '0'}`,
      status: invoice.status || 'draft',
      date: new Date(invoice.invoice_date || invoice.created_at).toLocaleDateString('fr-FR')
    };
  });

  const clientsData = clients.slice(0, 8).map(client => ({
    name: client.company_name,
    sector: client.industry || 'Non spécifié',
    revenue_ytd: '€0', // À calculer depuis les factures
    projects: 0, // À calculer depuis les projets
    satisfaction: 95 // Valeur par défaut
  }));

  const quotationsData = quotations.slice(0, 10).map(quotation => {
    const client = clients.find(c => c.id === quotation.client_id);
    return {
      number: quotation.quotation_number,
      client: client?.company_name || 'Client inconnu',
      service: quotation.title,
      amount: `€${quotation.total_amount?.toLocaleString() || '0'}`,
      status: quotation.status || 'draft',
      expiry: quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString('fr-FR') : 'Non définie'
    };
  });

  return (
    <div className="space-y-6">
      {/* KPIs Prestations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceTypes.map((service, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{service.revenue}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">{service.count} prestations</span>
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {service.growth}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Facturation</TabsTrigger>
          <TabsTrigger value="quotations">Devis</TabsTrigger>
          <TabsTrigger value="clients">Clients B2B</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Factures Commerciales</h3>
            <Button className="gap-2" onClick={handleNewInvoice}>
              <Plus className="w-4 h-4" />
              Nouvelle Facture
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {invoicesLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Chargement...</div>
                ) : recentInvoices.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">Aucune facture trouvée</div>
                ) : recentInvoices.map((invoice, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{invoice.number}</div>
                      <div className="text-sm text-muted-foreground">{invoice.client}</div>
                      <div className="text-sm text-muted-foreground">{invoice.service}</div>
                    </div>
                    <div className="text-center px-4">
                      <div className="font-bold">{invoice.amount}</div>
                      <div className="text-xs text-muted-foreground">{invoice.date}</div>
                    </div>
                    <div className="text-center">
                      <Badge variant={
                        invoice.status === 'paid' ? 'default' :
                        invoice.status === 'sent' ? 'secondary' : 'outline'
                      }>
                        {invoice.status === 'paid' ? 'Payée' :
                         invoice.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="ml-4" onClick={() => handleViewInvoice(invoice.number)}>
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Devis Commerciaux</h3>
            <Button className="gap-2" onClick={handleNewQuotation}>
              <Plus className="w-4 h-4" />
              Nouveau Devis
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {quotationsLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Chargement...</div>
                ) : quotationsData.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">Aucun devis trouvé</div>
                ) : quotationsData.map((quote, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{quote.number}</div>
                      <div className="text-sm text-muted-foreground">{quote.client}</div>
                      <div className="text-sm text-muted-foreground">{quote.service}</div>
                    </div>
                    <div className="text-center px-4">
                      <div className="font-bold">{quote.amount}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {quote.expiry}
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge variant={
                        quote.status === 'accepted' ? 'default' :
                        quote.status === 'sent' ? 'secondary' : 'outline'
                      }>
                        {quote.status === 'accepted' ? 'Accepté' :
                         quote.status === 'sent' ? 'Envoyé' : 'Brouillon'}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="ml-4" onClick={() => handleViewQuotation(quote.number)}>
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Portefeuille Clients B2B</h3>
            <Button className="gap-2" onClick={handleNewClient}>
              <Plus className="w-4 h-4" />
              Nouveau Client
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientsLoading ? (
              <div className="col-span-2 text-center text-muted-foreground">Chargement...</div>
            ) : clientsData.length === 0 ? (
              <div className="col-span-2 text-center text-muted-foreground">Aucun client trouvé</div>
            ) : clientsData.map((client, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-500" />
                    {client.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{client.sector}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">CA annuel:</span>
                      <span className="font-medium">{client.revenue_ytd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Projets actifs:</span>
                      <span className="font-medium">{client.projects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Satisfaction:</span>
                      <span className="font-medium text-green-600">{client.satisfaction}%</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-4" onClick={() => handleViewClient(client.name)}>
                    Voir Détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-green-500" />
                  Revenus YTD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">€433,500</div>
                <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  +18.5% vs année dernière
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Clients Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <div className="text-sm text-blue-600 flex items-center gap-1 mt-2">
                  <Plus className="w-3 h-3" />
                  +3 nouveaux ce trimestre
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Taux de Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">78%</div>
                <div className="text-sm text-purple-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  +5% ce mois
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance par Secteur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Technologie</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-sm font-medium">€156,000</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Conseil</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                    <span className="text-sm font-medium">€124,500</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Manufacturing</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '58%'}}></div>
                    </div>
                    <span className="text-sm font-medium">€89,200</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>RH</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm font-medium">€67,800</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau Client B2B</DialogTitle>
          </DialogHeader>
          <CommercialClientForm 
            onSubmit={async () => {
              setShowClientForm(false);
            }}
            onCancel={async () => {
              setShowClientForm(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showQuotationForm} onOpenChange={setShowQuotationForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau Devis Commercial</DialogTitle>
          </DialogHeader>
          <QuotationForm 
            clients={clients}
            onSubmit={async () => {
              setShowQuotationForm(false);
            }}
            onCancel={async () => {
              setShowQuotationForm(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Facture Commerciale</DialogTitle>
          </DialogHeader>
          <CommercialInvoiceForm 
            clients={clients}
            onSubmit={async () => {
              setShowInvoiceForm(false);
            }}
            onCancel={async () => {
              setShowInvoiceForm(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}