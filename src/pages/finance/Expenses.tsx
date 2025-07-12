import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExpenseDialog } from '@/components/finance/ExpenseDialog';
import { useExpenses } from '@/hooks/finance/useExpenses';
import { Receipt, Plus, Search, Filter } from 'lucide-react';
import type { Expense } from '@/hooks/finance/useExpenses';

const formatCurrency = (amount: number) => `€${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  paid: 'bg-blue-100 text-blue-800',
};

const statusLabels = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Rejetée',
  paid: 'Payée',
};

export default function Expenses() {
  const { expenses, loading } = useExpenses();
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.expense_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.approval_status === 'pending').length;
  const approvedExpenses = expenses.filter(e => e.approval_status === 'approved').length;

  const handleNewExpense = () => {
    setSelectedExpense(null);
    setShowExpenseDialog(true);
  };

  const stats = [
    {
      label: "Total des dépenses",
      value: formatCurrency(totalExpenses),
      change: "+5.2%",
      changeType: "positive" as const
    },
    {
      label: "En attente",
      value: pendingExpenses.toString(),
      change: "+2",
      changeType: "negative" as const
    },
    {
      label: "Approuvées",
      value: approvedExpenses.toString(),
      change: "+8",
      changeType: "positive" as const
    },
    {
      label: "Ce mois",
      value: formatCurrency(totalExpenses * 0.3),
      change: "+12%",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Gestion des Dépenses"
          subtitle="Suivi et validation des dépenses de l'établissement"
          stats={stats}
          showCreateButton={true}
          onCreateClick={handleNewExpense}
          createButtonText="Nouvelle dépense"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-500" />
                Liste des dépenses
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une dépense..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : (
                <div className="space-y-4">
                  {filteredExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{expense.expense_number}</div>
                        <div className="text-sm text-muted-foreground">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">{expense.supplier?.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(expense.amount)}</div>
                        <Badge className={statusColors[expense.approval_status]}>
                          {statusLabels[expense.approval_status]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <ExpenseDialog
          open={showExpenseDialog}
          onClose={() => {
            setShowExpenseDialog(false);
            setSelectedExpense(null);
          }}
          expense={selectedExpense}
          mode={selectedExpense ? 'edit' : 'create'}
        />
      </div>
    </ModuleLayout>
  );
}