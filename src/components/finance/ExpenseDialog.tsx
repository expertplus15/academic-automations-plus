import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useExpenses, type Expense } from '@/hooks/finance/useExpenses';
import { useSuppliers } from '@/hooks/finance/useSuppliers';
import { useFinancialCategories } from '@/hooks/finance/useFinancialCategories';
import { useFiscalYears } from '@/hooks/finance/useFiscalYears';
import { toast } from '@/hooks/use-toast';

const expenseSchema = z.object({
  supplier_id: z.string().min(1, 'Fournisseur requis'),
  financial_category_id: z.string().min(1, 'Catégorie requise'),
  amount: z.number().min(0.01, 'Montant requis'),
  expense_date: z.string().min(1, 'Date requise'),
  due_date: z.string().optional(),
  description: z.string().min(1, 'Description requise'),
  fiscal_year_id: z.string().min(1, 'Exercice fiscal requis'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
  mode: 'create' | 'edit' | 'view';
}

export function ExpenseDialog({ open, onClose, expense, mode }: ExpenseDialogProps) {
  const { createExpense, updateExpense } = useExpenses();
  const { suppliers } = useSuppliers();
  const { categories } = useFinancialCategories();
  const { fiscalYears } = useFiscalYears();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      supplier_id: expense?.supplier_id || '',
      financial_category_id: expense?.financial_category_id || '',
      amount: expense?.amount || 0,
      expense_date: expense?.expense_date || new Date().toISOString().split('T')[0],
      due_date: expense?.due_date || '',
      description: expense?.description || '',
      fiscal_year_id: expense?.fiscal_year_id || '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (mode === 'create') {
        await createExpense({
          supplier_id: data.supplier_id,
          financial_category_id: data.financial_category_id,
          amount: data.amount,
          expense_date: data.expense_date,
          due_date: data.due_date,
          description: data.description,
          fiscal_year_id: data.fiscal_year_id,
          approval_status: 'pending',
        });
        toast({
          title: "Succès",
          description: "Dépense créée avec succès",
        });
      } else if (mode === 'edit' && expense) {
        await updateExpense(expense.id, {
          supplier_id: data.supplier_id,
          financial_category_id: data.financial_category_id,
          amount: data.amount,
          expense_date: data.expense_date,
          due_date: data.due_date,
          description: data.description,
          fiscal_year_id: data.fiscal_year_id,
        });
        toast({
          title: "Succès",
          description: "Dépense mise à jour avec succès",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Impossible de ${mode === 'create' ? 'créer' : 'modifier'} la dépense`,
        variant: "destructive",
      });
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nouvelle dépense' : 
             mode === 'edit' ? 'Modifier la dépense' : 
             'Détails de la dépense'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isReadOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un fournisseur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="financial_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isReadOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expense_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de dépense</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'échéance</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fiscal_year_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercice fiscal</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isReadOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un exercice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fiscalYears.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description détaillée de la dépense..."
                      className="min-h-[80px]"
                      {...field}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                {isReadOnly ? 'Fermer' : 'Annuler'}
              </Button>
              {!isReadOnly && (
                <Button type="submit">
                  {mode === 'create' ? 'Créer' : 'Modifier'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}