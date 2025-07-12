import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommercialQuotations, CreateQuotationData } from '@/hooks/finance/useCommercialQuotations';
import { useCommercialClients } from '@/hooks/finance/useCommercialClients';
import { Plus, Trash2 } from 'lucide-react';

const quotationSchema = z.object({
  client_id: z.string().min(1, 'Veuillez sélectionner un client'),
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  valid_until: z.string().optional(),
  notes: z.string().optional(),
  terms_conditions: z.string().optional(),
  lines: z.array(z.object({
    service_name: z.string().min(1, 'Le nom du service est requis'),
    description: z.string().optional(),
    quantity: z.number().min(1, 'La quantité doit être supérieure à 0'),
    unit_price: z.number().min(0, 'Le prix unitaire doit être positif'),
    discount_percentage: z.number().min(0).max(100, 'La remise doit être entre 0 et 100%'),
  })).min(1, 'Au moins une ligne est requise'),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

interface QuotationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (quotation: any) => void;
}

export function QuotationDialog({ open, onClose, onSuccess }: QuotationDialogProps) {
  const { createQuotation, loading } = useCommercialQuotations();
  const { clients } = useCommercialClients();

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      client_id: '',
      title: '',
      description: '',
      valid_until: '',
      notes: '',
      terms_conditions: '',
      lines: [{ 
        service_name: '', 
        description: '', 
        quantity: 1, 
        unit_price: 0, 
        discount_percentage: 0 
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  });

  const watchedLines = form.watch('lines');

  const calculateLineTotal = (quantity: number, unitPrice: number, discount: number) => {
    return quantity * unitPrice * (1 - discount / 100);
  };

  const calculateTotals = () => {
    const subtotal = watchedLines.reduce((sum, line) => {
      return sum + calculateLineTotal(line.quantity || 0, line.unit_price || 0, line.discount_percentage || 0);
    }, 0);
    const taxAmount = subtotal * 0.20; // 20% TVA
    const totalAmount = subtotal + taxAmount;
    
    return { subtotal, taxAmount, totalAmount };
  };

  const { subtotal, taxAmount, totalAmount } = calculateTotals();

  const onSubmit = async (data: QuotationFormData) => {
    try {
      const quotationData: CreateQuotationData = {
        client_id: data.client_id,
        title: data.title,
        description: data.description,
        valid_until: data.valid_until,
        notes: data.notes,
        terms_conditions: data.terms_conditions,
        lines: data.lines.map(line => ({
          service_name: line.service_name,
          description: line.description || '',
          quantity: line.quantity,
          unit_price: line.unit_price,
          discount_percentage: line.discount_percentage,
          line_total: calculateLineTotal(line.quantity, line.unit_price, line.discount_percentage)
        })),
      };

      const result = await createQuotation(quotationData);
      if (result.data) {
        onSuccess(result.data);
        onClose();
        form.reset();
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
    }
  };

  const addLine = () => {
    append({ 
      service_name: '', 
      description: '', 
      quantity: 1, 
      unit_price: 0, 
      discount_percentage: 0 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau Devis Commercial</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.company_name}
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du devis</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Prestation de services..." {...field} />
                    </FormControl>
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
                      <Textarea placeholder="Description détaillée du devis..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valide jusqu'au</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Lignes du devis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Lignes du devis
                  <Button type="button" onClick={addLine} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une ligne
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.service_name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom du service" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qté</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.unit_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prix unitaire (€)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.discount_percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remise (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                max="100" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-2">
                      <FormLabel>Total ligne</FormLabel>
                      <div className="text-sm font-medium p-2 bg-muted rounded">
                        €{calculateLineTotal(
                          watchedLines[index]?.quantity || 0,
                          watchedLines[index]?.unit_price || 0,
                          watchedLines[index]?.discount_percentage || 0
                        ).toFixed(2)}
                      </div>
                    </div>

                    <div className="col-span-1">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Totaux */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total HT:</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA (20%):</span>
                      <span>€{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total TTC:</span>
                      <span>€{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes et conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes internes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notes pour usage interne..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conditions générales</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Conditions générales de vente..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer le devis'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}