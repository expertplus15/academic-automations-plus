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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSuppliers, type Supplier } from '@/hooks/finance/useSuppliers';
import { toast } from '@/hooks/use-toast';

const supplierSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  siret: z.string().optional(),
  address: z.string().optional(),
  contact_email: z.string().email('Email invalide').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  payment_terms: z.number().min(0, 'Délai de paiement invalide').default(30),
  is_active: z.boolean().default(true),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierDialogProps {
  open: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
  mode: 'create' | 'edit' | 'view';
}

export function SupplierDialog({ open, onClose, supplier, mode }: SupplierDialogProps) {
  const { createSupplier } = useSuppliers();

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || '',
      siret: supplier?.siret || '',
      address: supplier?.address || '',
      contact_email: supplier?.contact_email || '',
      contact_phone: supplier?.contact_phone || '',
      payment_terms: supplier?.payment_terms || 30,
      is_active: supplier?.is_active ?? true,
    },
  });

  const onSubmit = async (data: SupplierFormData) => {
    try {
      if (mode === 'create') {
        await createSupplier({
          name: data.name,
          siret: data.siret,
          address: data.address,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          payment_terms: data.payment_terms,
          is_active: data.is_active,
        });
        toast({
          title: "Succès",
          description: "Fournisseur créé avec succès",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Impossible de ${mode === 'create' ? 'créer' : 'modifier'} le fournisseur`,
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
            {mode === 'create' ? 'Nouveau fournisseur' : 
             mode === 'edit' ? 'Modifier le fournisseur' : 
             'Détails du fournisseur'}
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
                    <FormLabel>Nom du fournisseur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'entreprise" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIRET</FormLabel>
                    <FormControl>
                      <Input placeholder="14 chiffres" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de contact</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="contact@fournisseur.com" 
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
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="01 23 45 67 89" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Délai de paiement (jours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adresse complète du fournisseur..."
                      className="min-h-[80px]"
                      {...field}
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isReadOnly && (
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Fournisseur actif</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Ce fournisseur peut être sélectionné pour de nouvelles commandes
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
            )}

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