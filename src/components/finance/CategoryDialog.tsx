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
import { Switch } from '@/components/ui/switch';
import { useFinancialCategories, type FinancialCategory } from '@/hooks/finance/useFinancialCategories';
import { toast } from '@/hooks/use-toast';

const categorySchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  code: z.string().min(1, 'Code requis'),
  description: z.string().optional(),
  category_type: z.enum(['revenue', 'expense', 'asset', 'liability']),
  is_active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: FinancialCategory | null;
  mode: 'create' | 'edit';
}

const categoryTypeOptions = [
  { value: 'revenue', label: 'Produit' },
  { value: 'expense', label: 'Charge' },
  { value: 'asset', label: 'Actif' },
  { value: 'liability', label: 'Passif' },
];

export function CategoryDialog({ open, onClose, category, mode }: CategoryDialogProps) {
  const { createCategory, updateCategory } = useFinancialCategories();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      code: category?.code || '',
      description: category?.description || '',
      category_type: (category?.category_type as 'revenue' | 'expense' | 'asset' | 'liability') || 'expense',
      is_active: category?.is_active ?? true,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (mode === 'create') {
        await createCategory({
          name: data.name,
          code: data.code,
          description: data.description,
          category_type: data.category_type,
          is_active: data.is_active,
        });
        toast({
          title: "Succès",
          description: "Catégorie créée avec succès",
        });
      } else if (mode === 'edit' && category) {
        await updateCategory(category.id, {
          name: data.name,
          code: data.code,
          description: data.description,
          category_type: data.category_type,
          is_active: data.is_active,
        });
        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Impossible de ${mode === 'create' ? 'créer' : 'modifier'} la catégorie`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de la catégorie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="CODE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de catégorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de la catégorie..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Catégorie active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Cette catégorie peut être utilisée dans les transactions
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Créer' : 'Modifier'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}