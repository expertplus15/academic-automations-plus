import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  CheckSquare,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload
} from 'lucide-react';

export default function Reconciliation() {
  const [searchTerm, setSearchTerm] = useState('');

  const bankTransactions = [
    {
      id: '1',
      date: '2024-01-25',
      description: 'VIREMENT ETUDIANT MARTIN JEAN',
      amount: 2500,
      reference: 'VIR240125001',
      status: 'matched',
      matchedInvoice: 'FAC240001'
    },
    {
      id: '2',
      date: '2024-01-24',
      description: 'CB ACHAT MATERIEL PEDAGOGIQUE',
      amount: -850,
      reference: 'CB240124003',
      status: 'unmatched',
      matchedInvoice: null
    },
    {
      id: '3',
      date: '2024-01-23',
      description: 'CHEQUE FORMATION CONTINUE',
      amount: 1200,
      reference: 'CHQ240123001',
      status: 'pending',
      matchedInvoice: null
    },
    {
      id: '4',
      date: '2024-01-22',
      description: 'VIREMENT SALAIRE ENSEIGNANT',
      amount: -3200,
      reference: 'VIR240122005',
      status: 'matched',
      matchedInvoice: 'SAL240015'
    }
  ];

  const stats = [
    {
      label: "Transactions rapprochées",
      value: bankTransactions.filter(t => t.status === 'matched').length.toString(),
      change: "+5",
      changeType: "positive" as const
    },
    {
      label: "En attente",
      value: bankTransactions.filter(t => t.status === 'pending').length.toString(),
      change: "+1",
      changeType: "neutral" as const
    },
    {
      label: "Non rapprochées",
      value: bankTransactions.filter(t => t.status === 'unmatched').length.toString(),
      change: "-2",
      changeType: "positive" as const
    },
    {
      label: "Taux de rapprochement",
      value: `${Math.round((bankTransactions.filter(t => t.status === 'matched').length / bankTransactions.length) * 100)}%`,
      change: "+5%",
      changeType: "positive" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      matched: "bg-green-100 text-green-700 border-green-200",
      unmatched: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200"
    };
    const labels = {
      matched: "Rapproché",
      unmatched: "Non rapproché",
      pending: "En attente"
    };
    return { variant: variants[status as keyof typeof variants], label: labels[status as keyof typeof labels] };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'unmatched': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  const filteredTransactions = bankTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Rapprochement bancaire"
          subtitle="Réconciliation des transactions bancaires et comptables"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white rounded-2xl shadow-sm border-0 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-blue-100 rounded-xl mx-auto w-fit mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Importer relevé</h3>
              <p className="text-sm text-muted-foreground">Fichier bancaire CSV/OFX</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-green-100 rounded-xl mx-auto w-fit mb-3">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Rapprochement auto</h3>
              <p className="text-sm text-muted-foreground">Correspondance automatique</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-[rgb(245,158,11)]/20 rounded-xl mx-auto w-fit mb-3">
                <Download className="w-6 h-6 text-[rgb(245,158,11)]" />
              </div>
              <h3 className="font-semibold mb-2">Exporter rapport</h3>
              <p className="text-sm text-muted-foreground">Rapport de rapprochement</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-purple-100 rounded-xl mx-auto w-fit mb-3">
                <AlertTriangle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Écarts non résolus</h3>
              <p className="text-sm text-muted-foreground">3 transactions en suspens</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une transaction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Badge className="w-4 h-4" />
                  Statut
                </Button>
                <Button variant="outline" className="gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Type
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions bancaires */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[rgb(245,158,11)]" />
              Transactions bancaires ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const statusInfo = getStatusBadge(transaction.status);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                        {getStatusIcon(transaction.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{transaction.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.reference}
                          </Badge>
                          <Badge className={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Date: {new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                          {transaction.matchedInvoice && (
                            <span>Rapproché avec: {transaction.matchedInvoice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}€{transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.amount > 0 ? 'Crédit' : 'Débit'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="w-3 h-3" />
                          Détails
                        </Button>
                        {transaction.status === 'unmatched' && (
                          <Button size="sm" className="gap-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                            <CheckSquare className="w-3 h-3" />
                            Rapprocher
                          </Button>
                        )}
                        {transaction.status === 'pending' && (
                          <Button size="sm" variant="outline" className="gap-1 text-yellow-600 hover:text-yellow-700">
                            <Clock className="w-3 h-3" />
                            Valider
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Résumé du rapprochement */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle>Résumé du rapprochement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-2">€5,700</div>
                <div className="text-sm text-green-700">Transactions rapprochées</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600 mb-2">€1,200</div>
                <div className="text-sm text-yellow-700">En attente de validation</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600 mb-2">€850</div>
                <div className="text-sm text-red-700">Non rapprochées</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}