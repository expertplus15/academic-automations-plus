import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Receipt, Calendar, Calculator } from 'lucide-react';
import { CreateInvoiceData, InvoiceLine } from '@/hooks/finance/useCommercialInvoices';
import { CommercialClient } from '@/hooks/finance/useCommercialClients';
import { CommercialQuotation } from '@/hooks/finance/useCommercialQuotations';

const lineSchema = z.object({
  service_name: z.string().min(1, "Service requis"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(0.01, "Quantité minimum 0.01"),
  unit_price: z.coerce.number().min(0, "Prix unitaire minimum 0"),
  discount_percentage: z.coerce.number().min(0).max(100).default(0),
  line_total: z.number()
});

const invoiceSchema = z.object({
  client_id: z.string().min(1, "Client requis"),
  quotation_id: z.string().optional(),
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
  terms_conditions: z.string().optional(),
  lines: z.array(lineSchema).min(1, "Au moins une ligne requise")
});

interface CommercialInvoiceFormProps {
  clients: CommercialClient[];
  quotations?: CommercialQuotation[];
  onSubmit: (data: CreateInvoiceData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  selectedQuotation?: CommercialQuotation;
}

export function CommercialInvoiceForm({ 
  clients, 
  quotations = [], 
  onSubmit, 
  onCancel, 
  isLoading,
  selectedQuotation 
}: CommercialInvoiceFormProps) {
  const [taxRate] = useState(20);
  const [selectedClientId, setSelectedClientId] = useState(selectedQuotation?.client_id || '');

  const form = useForm<CreateInvoiceData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client_id: selectedQuotation?.client_id || '',
      quotation_id: selectedQuotation?.id || '',
      title: selectedQuotation?.title || '',
      description: selectedQuotation?.description || '',
      due_date: '',
      notes: '',
      terms_conditions: 'Paiement sous 30 jours. TVA applicable selon réglementation en vigueur.',
      lines: selectedQuotation?.quotation_lines?.map(line => ({
        service_name: line.service_name,
        description: line.description || '',
        quantity: line.quantity,
        unit_price: line.unit_price,
        discount_percentage: line.discount_percentage,
        line_total: line.line_total
      })) || [{
        service_name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        discount_percentage: 0,
        line_total: 0
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines"
  });

  const watchedLines = form.watch("lines");
  const watchedClientId = form.watch("client_id");

  const calculateLineTotal = (index: number) => {
    const line = watchedLines[index];
    if (!line) return 0;
    
    const baseAmount = line.quantity * line.unit_price;
    const discountAmount = baseAmount * (line.discount_percentage / 100);
    const total = baseAmount - discountAmount;
    
    form.setValue(`lines.${index}.line_total`, total);
    return total;
  };

  const calculateTotals = () => {
    const subtotal = watchedLines.reduce((sum, line, index) => {
      return sum + calculateLineTotal(index);
    }, 0);
    
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;
    
    return { subtotal, taxAmount, totalAmount };
  };

  const { subtotal, taxAmount, totalAmount } = calculateTotals();

  const addLine = () => {
    append({
      service_name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
      line_total: 0
    });
  };

  const removeLine = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const getDueDateDefault = () => {
    const selectedClient = clients.find(c => c.id === watchedClientId);
    const paymentTerms = selectedClient?.payment_terms || 30;
    
    const date = new Date();
    date.setDate(date.getDate() + paymentTerms);
    return date.toISOString().split('T')[0];
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    form.setValue('client_id', clientId);
    
    // Update due date based on client's payment terms
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      const dueDate = getDueDateDefault();
      form.setValue('due_date', dueDate);
    }
  };

  const handleQuotationChange = (quotationId: string) => {
    const quotation = quotations.find(q => q.id === quotationId);
    if (quotation) {
      form.setValue('quotation_id', quotationId);
      form.setValue('client_id', quotation.client_id);
      form.setValue('title', quotation.title);
      form.setValue('description', quotation.description || '');
      
      // Load quotation lines
      if (quotation.quotation_lines) {
        form.setValue('lines', quotation.quotation_lines.map(line => ({
          service_name: line.service_name,
          description: line.description || '',
          quantity: line.quantity,
          unit_price: line.unit_price,
          discount_percentage: line.discount_percentage,
          line_total: line.line_total
        })));
      }
    }
  };

  const handleSubmit = async (data: CreateInvoiceData) => {
    const processedData = {
      ...data,
      lines: data.lines.map(line => ({
        ...line,
        line_total: line.quantity * line.unit_price * (1 - line.discount_percentage / 100)
      }))
    };
    
    await onSubmit(processedData);
  };

  const availableQuotations = quotations.filter(q => 
    q.status === 'accepted' && q.client_id === watchedClientId
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Nouvelle facture commerciale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* En-tête de la facture */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <Select onValueChange={handleClientChange} value={field.value}>
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
                  name="quotation_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devis (optionnel)</FormLabel>
                      <Select onValueChange={handleQuotationChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un devis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Aucun devis</SelectItem>
                          {availableQuotations.map((quotation) => (
                            <SelectItem key={quotation.id} value={quotation.id}>
                              {quotation.quotation_number} - {quotation.title}
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
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date d'échéance
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          defaultValue={getDueDateDefault()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de la facture *</FormLabel>
                    <FormControl>
                      <Input placeholder="Prestations de développement web" {...field} />
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
                      <Textarea 
                        placeholder="Description détaillée des prestations facturées..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Lignes de la facture */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Lignes de facturation</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addLine}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une ligne
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Ligne {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLine(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.service_name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Service *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Développement site web" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`lines.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Description détaillée" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name={`lines.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantité</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="1"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setTimeout(() => calculateLineTotal(index), 0);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

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
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setTimeout(() => calculateLineTotal(index), 0);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

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
                                    step="0.01"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setTimeout(() => calculateLineTotal(index), 0);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Total ligne</label>
                            <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                              {calculateLineTotal(index).toFixed(2)} €
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totaux */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total HT :</span>
                      <span className="font-medium">{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA ({taxRate}%) :</span>
                      <span className="font-medium">{taxAmount.toFixed(2)} €</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total TTC :</span>
                      <span className="text-primary">{totalAmount.toFixed(2)} €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notes internes ou commentaires..."
                          className="min-h-[100px]"
                          {...field} 
                        />
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
                      <FormLabel>Conditions de paiement</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Conditions de paiement et modalités..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Création..." : "Créer la facture"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}