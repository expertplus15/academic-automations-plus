import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, Upload, Download, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useBankReconciliation } from '@/hooks/finance/useBankReconciliation';
import { ReconciliationUpload } from '@/components/finance/ReconciliationUpload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function Reconciliation() {
  const { bankTransactions, pendingMatches, loading, autoMatch, validateMatches } = useBankReconciliation();

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const stats = [
    {
      label: "Transactions importées",
      value: bankTransactions.length.toString(),
      change: "+15",
      changeType: "positive" as const
    },
    {
      label: "Non rapprochées",
      value: bankTransactions.filter(t => !t.is_reconciled).length.toString(),
      change: "-3",
      changeType: "negative" as const
    },
    {
      label: "Correspondances trouvées",
      value: pendingMatches.length.toString()
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Réconciliation Bancaire"
          subtitle="Import et rapprochement automatique des écritures bancaires"
          stats={stats}
          showCreateButton={true}
          createButtonText="Rapprochement auto"
          onCreateClick={autoMatch}
          showExportButton={true}
        />

        <div className="grid gap-6">
          <ReconciliationUpload />

          {bankTransactions.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transactions bancaires</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={autoMatch} disabled={loading}>
                    <Zap className="w-4 h-4 mr-2" />
                    Rapprochement automatique
                  </Button>
                  {pendingMatches.length > 0 && (
                    <Button onClick={() => validateMatches(pendingMatches)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Valider ({pendingMatches.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.transaction_type === 'credit' ? 'default' : 'outline'}>
                            {transaction.transaction_type === 'credit' ? 'Crédit' : 'Débit'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.is_reconciled ? 'default' : 'secondary'}>
                            {transaction.is_reconciled ? 'Rapproché' : 'En attente'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {pendingMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  Correspondances en attente de validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingMatches.map((match, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{match.bank_transaction.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(match.bank_transaction.transaction_date), 'dd/MM/yyyy')} - 
                            {formatCurrency(match.bank_transaction.amount)}
                          </p>
                        </div>
                        <Badge variant="outline">
                          Score: {Math.round(match.match_score)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}