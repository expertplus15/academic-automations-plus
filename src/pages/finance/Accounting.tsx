import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChartOfAccounts } from '@/hooks/finance/useChartOfAccounts';
import { Calculator, Plus, FileText, BarChart3, Book, AlertTriangle } from 'lucide-react';
import { useAccountingEntries } from '@/hooks/finance/useAccountingEntries';
import { AccountingEntryDialog } from '@/components/finance/AccountingEntryDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function Accounting() {
  const { entries, loading, validateEntry } = useAccountingEntries();
  const { accounts } = useChartOfAccounts();
  const [showNewEntry, setShowNewEntry] = useState(false);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const stats = [
    {
      label: "Écritures ce mois",
      value: entries.filter(e => 
        new Date(e.entry_date).getMonth() === new Date().getMonth()
      ).length.toString(),
      change: "+12%",
      changeType: "positive" as const
    },
    {
      label: "En attente de validation",
      value: entries.filter(e => e.status === 'draft').length.toString(),
      change: "-5%",
      changeType: "negative" as const
    },
    {
      label: "Comptes actifs",
      value: accounts?.filter(a => a.is_active).length.toString() || "0"
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Comptabilité"
          subtitle="Gestion des écritures comptables et du plan de comptes"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle écriture"
          onCreateClick={() => setShowNewEntry(true)}
          showExportButton={true}
        />

        <Tabs defaultValue="entries" className="space-y-4">
          <TabsList>
            <TabsTrigger value="entries">Écritures</TabsTrigger>
            <TabsTrigger value="accounts">Plan comptable</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Journal des écritures</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Référence</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{format(new Date(entry.entry_date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{entry.reference_number}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>{formatCurrency(entry.total_amount)}</TableCell>
                          <TableCell>
                            <Badge variant={entry.status === 'validated' ? 'default' : 'secondary'}>
                              {entry.status === 'validated' ? 'Validée' : 'Brouillon'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {entry.status === 'draft' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => validateEntry(entry.id)}
                              >
                                Valider
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plan comptable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {accounts?.map((account) => (
                    <div key={account.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">{account.account_number}</span>
                        <span className="ml-2">{account.account_name}</span>
                      </div>
                      <Badge variant="outline">{account.account_type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rapports comptables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    Grand livre
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Balance
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Book className="w-6 h-6 mb-2" />
                    Bilan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AccountingEntryDialog
          open={showNewEntry}
          onClose={() => setShowNewEntry(false)}
          onSuccess={() => setShowNewEntry(false)}
        />
      </div>
    </ModuleLayout>
  );
}