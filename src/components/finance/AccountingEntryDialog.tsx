import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';
import { useChartOfAccounts } from '@/hooks/finance/useChartOfAccounts';
import { useAccountingEntries } from '@/hooks/finance/useAccountingEntries';

interface AccountingEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface EntryLine {
  account_id: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
}

export function AccountingEntryDialog({ open, onClose, onSuccess }: AccountingEntryDialogProps) {
  const { accounts } = useChartOfAccounts();
  const { createEntry } = useAccountingEntries();
  const [loading, setLoading] = useState(false);
  
  const [entryData, setEntryData] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [lines, setLines] = useState<EntryLine[]>([
    { account_id: '', description: '', debit_amount: 0, credit_amount: 0 },
    { account_id: '', description: '', debit_amount: 0, credit_amount: 0 },
  ]);

  const addLine = () => {
    setLines([...lines, { account_id: '', description: '', debit_amount: 0, credit_amount: 0 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof EntryLine, value: string | number) => {
    const updatedLines = [...lines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    setLines(updatedLines);
  };

  const totalDebit = lines.reduce((sum, line) => sum + line.debit_amount, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.credit_amount, 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    try {
      setLoading(true);
      await createEntry({
        ...entryData,
        lines: lines.filter(line => line.account_id && (line.debit_amount > 0 || line.credit_amount > 0))
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error handled by hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle écriture comptable</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry_date">Date d'écriture</Label>
              <Input
                id="entry_date"
                type="date"
                value={entryData.entry_date}
                onChange={(e) => setEntryData({ ...entryData, entry_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={entryData.description}
                onChange={(e) => setEntryData({ ...entryData, description: e.target.value })}
                placeholder="Description de l'écriture"
              />
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lignes d'écriture</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une ligne
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {lines.map((line, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <Label>Compte</Label>
                    <Select
                      value={line.account_id}
                      onValueChange={(value) => updateLine(index, 'account_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un compte" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts?.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_number} - {account.account_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label>Description</Label>
                    <Input
                      value={line.description}
                      onChange={(e) => updateLine(index, 'description', e.target.value)}
                      placeholder="Description ligne"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Débit</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={line.debit_amount || ''}
                      onChange={(e) => updateLine(index, 'debit_amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Crédit</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={line.credit_amount || ''}
                      onChange={(e) => updateLine(index, 'credit_amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLine(index)}
                      disabled={lines.length <= 2}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-x-4">
                  <span>Total Débit: <strong>{totalDebit.toFixed(2)} €</strong></span>
                  <span>Total Crédit: <strong>{totalCredit.toFixed(2)} €</strong></span>
                </div>
                {!isBalanced && (
                  <span className="text-red-500 text-sm">
                    L'écriture doit être équilibrée (Débit = Crédit)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={!isBalanced || loading}>
              {loading ? 'Création...' : 'Créer l\'écriture'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}