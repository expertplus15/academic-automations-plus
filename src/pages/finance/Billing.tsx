import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedInvoiceForm } from '@/components/finance/EnhancedInvoiceForm';
import { FreeInvoiceForm } from '@/components/finance/FreeInvoiceForm';
import { useFinanceData } from '@/hooks/useFinanceData';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Send,
  FileText,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showFreeInvoiceForm, setShowFreeInvoiceForm] = useState(false);
  const { fetchInvoices } = useFinanceData();

  const invoices = [
    {
      id: "FAC-2024-001",
      student: "Marie Dubois",
      studentNumber: "ETU240001",
      program: "Master Informatique",
      amount: 2500,
      issueDate: "2024-01-01",
      dueDate: "2024-01-31",
      status: "paid",
      paidAmount: 2500
    },
    {
      id: "FAC-2024-002",
      student: "Jean Martin",
      studentNumber: "ETU240002",
      program: "Licence Mathématiques",
      amount: 2800,
      issueDate: "2024-01-01",
      dueDate: "2024-01-31",
      status: "pending",
      paidAmount: 0
    },
    {
      id: "FAC-2024-003",
      student: "Sophie Laurent",
      studentNumber: "ETU240003",
      program: "Master Physique",
      amount: 2300,
      issueDate: "2024-01-01",
      dueDate: "2024-01-15",
      status: "overdue",
      paidAmount: 1000
    },
    {
      id: "FAC-2024-004",
      student: "Pierre Durand",
      studentNumber: "ETU240004",
      program: "Licence Chimie",
      amount: 2600,
      issueDate: "2024-01-02",
      dueDate: "2024-02-01",
      status: "draft",
      paidAmount: 0
    }
  ];

  const stats = [
    {
      label: "Total facturé",
      value: "€125,340",
      change: "+8.2%",
      changeType: "positive" as const
    },
    {
      label: "Factures payées",
      value: "89",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "En attente",
      value: "23",
      change: "-5%",
      changeType: "positive" as const
    },
    {
      label: "En retard",
      value: "8",
      change: "+2",
      changeType: "negative" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      overdue: "bg-red-100 text-red-700 border-red-200",
      draft: "bg-gray-100 text-gray-700 border-gray-200"
    };

    const labels = {
      paid: "Payée",
      pending: "En attente",
      overdue: "En retard",
      draft: "Brouillon"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Facturation"
          subtitle="Gestion des factures et de la facturation étudiants"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle facture"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
          onCreateClick={() => setShowInvoiceForm(true)}
        />

        <EnhancedInvoiceForm 
          open={showInvoiceForm} 
          onOpenChange={setShowInvoiceForm}
          onSuccess={fetchInvoices}
        />

        <FreeInvoiceForm 
          open={showFreeInvoiceForm} 
          onOpenChange={setShowFreeInvoiceForm}
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
                    placeholder="Rechercher par nom, numéro étudiant ou facture..."
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
                        <p className="font-semibold text-foreground">{invoice.id}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.student} • {invoice.studentNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">{invoice.program}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">
                        €{invoice.amount.toLocaleString()}
                      </span>
                    </div>
                    {invoice.paidAmount > 0 && invoice.paidAmount < invoice.amount && (
                      <p className="text-xs text-muted-foreground">
                        Payé: €{invoice.paidAmount.toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="w-3 h-3" />
                      Éditer
                    </Button>
                    {invoice.status === 'draft' && (
                      <Button size="sm" className="gap-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                        <Send className="w-3 h-3" />
                        Envoyer
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
              <Button 
                onClick={() => setShowFreeInvoiceForm(true)}
                className="gap-2 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90"
              >
                <FileText className="w-4 h-4" />
                Facture libre
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4" />
                Envoyer relances
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Facturation automatique
              </Button>
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Rapport de facturation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}