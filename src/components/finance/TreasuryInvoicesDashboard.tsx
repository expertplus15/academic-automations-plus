import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { 
  FileText, 
  Users, 
  Building, 
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Euro,
  Calendar,
  TrendingUp,
  Filter
} from 'lucide-react';

export function TreasuryInvoicesDashboard() {
  const { invoices, loading } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data pour les factures étudiants
  const studentInvoices = [
    {
      id: "INV-STU-2024-0234",
      studentName: "Marie Dubois",
      studentNumber: "ETU24001",
      program: "Master Informatique",
      amount: 2500,
      paidAmount: 2500,
      status: "paid",
      dueDate: "2024-03-15",
      issueDate: "2024-02-15"
    },
    {
      id: "INV-STU-2024-0235",
      studentName: "Jean Martin", 
      studentNumber: "ETU24002",
      program: "Licence Commerce",
      amount: 1800,
      paidAmount: 900,
      status: "partial",
      dueDate: "2024-03-20",
      issueDate: "2024-02-20"
    },
    {
      id: "INV-STU-2024-0236",
      studentName: "Sophie Laurent",
      studentNumber: "ETU24003", 
      program: "Master Finance",
      amount: 3200,
      paidAmount: 0,
      status: "pending",
      dueDate: "2024-03-25",
      issueDate: "2024-02-25"
    }
  ];

  // Mock data pour les factures commerciales
  const commercialInvoices = [
    {
      id: "INV-COM-2024-0067",
      clientName: "Entreprise TechCorp",
      serviceType: "Formation continue",
      amount: 15000,
      paidAmount: 15000,
      status: "paid",
      dueDate: "2024-03-10",
      issueDate: "2024-02-10"
    },
    {
      id: "INV-COM-2024-0068",
      clientName: "Conseil Municipal",
      serviceType: "Audit formations",
      amount: 8500,
      paidAmount: 0,
      status: "pending",
      dueDate: "2024-03-30",
      issueDate: "2024-03-01"
    },
    {
      id: "INV-COM-2024-0069",
      clientName: "Association Pro Skills",
      serviceType: "Certification professionnelle",
      amount: 4200,
      paidAmount: 2100,
      status: "partial",
      dueDate: "2024-04-05",
      issueDate: "2024-03-05"
    }
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusBadge = (status: string, paidAmount: number, totalAmount: number) => {
    if (status === 'paid' || paidAmount === totalAmount) {
      return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Encaissée</Badge>;
    } else if (paidAmount > 0) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" />Partielle</Badge>;
    } else if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Impayée</Badge>;
    }
  };

  const studentStats = {
    total: studentInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: studentInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    pending: studentInvoices.filter(inv => inv.paidAmount === 0).length,
    partial: studentInvoices.filter(inv => inv.paidAmount > 0 && inv.paidAmount < inv.amount).length
  };

  const commercialStats = {
    total: commercialInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: commercialInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    pending: commercialInvoices.filter(inv => inv.paidAmount === 0).length,
    partial: commercialInvoices.filter(inv => inv.paidAmount > 0 && inv.paidAmount < inv.amount).length
  };

  return (
    <div className="space-y-6">
      {/* Contrôles et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par numéro, nom, entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="paid">Encaissées</SelectItem>
              <SelectItem value="partial">Partielles</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatAmount(studentStats.total + commercialStats.total)}
              </div>
              <div className="text-sm text-muted-foreground">Facturé total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(studentStats.paid + commercialStats.paid)}
              </div>
              <div className="text-sm text-muted-foreground">Encaissé</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {studentStats.pending + commercialStats.pending}
              </div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(((studentStats.paid + commercialStats.paid) / (studentStats.total + commercialStats.total)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Taux encaissement</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets Étudiants / Commercial */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Factures Étudiants
            <Badge variant="secondary">{studentInvoices.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="commercial" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Factures Commerciales
            <Badge variant="secondary">{commercialInvoices.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          {/* Statistiques étudiants */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-semibold">{formatAmount(studentStats.total)}</div>
                    <div className="text-xs text-muted-foreground">Total facturé</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="font-semibold">{formatAmount(studentStats.paid)}</div>
                    <div className="text-xs text-muted-foreground">Encaissé</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div>
                    <div className="font-semibold">{studentStats.pending}</div>
                    <div className="text-xs text-muted-foreground">En attente</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="font-semibold">{((studentStats.paid / studentStats.total) * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Taux encaissement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste factures étudiants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Factures Étudiants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentInvoices.map((invoice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Users className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.studentName} ({invoice.studentNumber})</p>
                        <p className="text-xs text-muted-foreground">{invoice.program}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-foreground">{formatAmount(invoice.amount)}</p>
                      {invoice.paidAmount > 0 && (
                        <p className="text-sm text-green-600">Encaissé: {formatAmount(invoice.paidAmount)}</p>
                      )}
                      <div className="flex items-center gap-2">
                        {getStatusBadge(invoice.status, invoice.paidAmount, invoice.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Échéance: {invoice.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-4">
          {/* Statistiques commercial */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="font-semibold">{formatAmount(commercialStats.total)}</div>
                    <div className="text-xs text-muted-foreground">Total facturé</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="font-semibold">{formatAmount(commercialStats.paid)}</div>
                    <div className="text-xs text-muted-foreground">Encaissé</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div>
                    <div className="font-semibold">{commercialStats.pending}</div>
                    <div className="text-xs text-muted-foreground">En attente</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="font-semibold">{((commercialStats.paid / commercialStats.total) * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Taux encaissement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste factures commercial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Factures Commerciales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commercialInvoices.map((invoice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Building className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                        <p className="text-xs text-muted-foreground">{invoice.serviceType}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-foreground">{formatAmount(invoice.amount)}</p>
                      {invoice.paidAmount > 0 && (
                        <p className="text-sm text-green-600">Encaissé: {formatAmount(invoice.paidAmount)}</p>
                      )}
                      <div className="flex items-center gap-2">
                        {getStatusBadge(invoice.status, invoice.paidAmount, invoice.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Échéance: {invoice.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}