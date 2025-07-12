import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

export function CommercialBilling() {
  const { toast } = useToast();

  const handleNewInvoice = () => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La facturation commerciale sera disponible dans une prochaine version",
      variant: "destructive"
    });
  };

  const handleNewQuotation = () => {
    toast({
      title: "Fonctionnalité en développement", 
      description: "La création de devis commerciaux sera disponible dans une prochaine version",
      variant: "destructive"
    });
  };

  const handleNewClient = () => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La gestion des clients B2B sera disponible dans une prochaine version",
      variant: "destructive"
    });
  };

  const handleViewInvoice = (invoiceNumber: string) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La consultation détaillée des factures sera disponible prochainement",
      variant: "destructive"
    });
  };

  const handleViewQuotation = (quoteNumber: string) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La consultation détaillée des devis sera disponible prochainement", 
      variant: "destructive"
    });
  };

  const handleViewClient = (clientName: string) => {
    toast({
      title: "Fonctionnalité en développement",
      description: "La gestion détaillée des clients sera disponible prochainement",
      variant: "destructive"
    });
  };
  const serviceTypes = [
    { name: "Formations Inter-entreprises", revenue: "€85,200", count: 12, growth: "+15%" },
    { name: "Audits & Conseil", revenue: "€124,500", count: 8, growth: "+23%" },
    { name: "Prestations RH", revenue: "€67,800", count: 15, growth: "+8%" },
    { name: "Recherche & Développement", revenue: "€156,000", count: 6, growth: "+31%" }
  ];

  const recentInvoices = [
    {
      number: "COM24-0023",
      client: "TechCorp Industries",
      service: "Formation Management",
      amount: "€12,500",
      status: "paid",
      date: "2024-03-15"
    },
    {
      number: "COM24-0024", 
      client: "Innovation Labs",
      service: "Audit Processus",
      amount: "€28,000",
      status: "sent",
      date: "2024-03-18"
    },
    {
      number: "COM24-0025",
      client: "Global Solutions",
      service: "Conseil Stratégique",
      amount: "€45,000",
      status: "draft",
      date: "2024-03-20"
    }
  ];

  const clients = [
    {
      name: "TechCorp Industries",
      sector: "Technologie",
      revenue_ytd: "€78,500",
      projects: 5,
      satisfaction: 98
    },
    {
      name: "Innovation Labs",
      sector: "R&D",
      revenue_ytd: "€156,000", 
      projects: 8,
      satisfaction: 95
    },
    {
      name: "Global Solutions",
      sector: "Conseil",
      revenue_ytd: "€203,400",
      projects: 12,
      satisfaction: 97
    },
    {
      name: "Future Dynamics",
      sector: "Manufacturing",
      revenue_ytd: "€89,200",
      projects: 6,
      satisfaction: 92
    }
  ];

  const quotations = [
    {
      number: "DEV24-0012",
      client: "Smart Industries",
      service: "Transformation Digitale",
      amount: "€85,000",
      status: "pending",
      expiry: "2024-04-15"
    },
    {
      number: "DEV24-0013",
      client: "Green Energy Corp",
      service: "Audit Environnemental",
      amount: "€32,000",
      status: "negotiation",
      expiry: "2024-04-20"
    },
    {
      number: "DEV24-0014",
      client: "NextGen Solutions",
      service: "Formation Leadership",
      amount: "€18,500",
      status: "accepted",
      expiry: "2024-04-25"
    }
  ];

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
                {recentInvoices.map((invoice, index) => (
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
                {quotations.map((quote, index) => (
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
                        quote.status === 'negotiation' ? 'secondary' : 'outline'
                      }>
                        {quote.status === 'accepted' ? 'Accepté' :
                         quote.status === 'negotiation' ? 'Négociation' : 'En attente'}
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
            {clients.map((client, index) => (
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
    </div>
  );
}