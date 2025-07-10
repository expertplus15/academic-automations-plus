import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useStudents } from '@/hooks/useStudents';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceFormSchema, type InvoiceFormData } from '@/lib/validations';
import { Calendar, Plus, Trash2 } from 'lucide-react';

interface InvoiceServiceLine {
  id: string;
  service_type_id: string;
  fee_type_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  tax_rate: number;
  tax_amount: number;
}

interface EnhancedInvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EnhancedInvoiceForm({ open, onOpenChange, onSuccess }: EnhancedInvoiceFormProps) {
  const [serviceLines, setServiceLines] = useState<InvoiceServiceLine[]>([
    {
      id: '1',
      service_type_id: '',
      fee_type_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      tax_rate: 0,
      tax_amount: 0
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const { createInvoice, fiscalYears, serviceTypes, feeTypes } = useFinanceData();
  const { students } = useStudents();
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      student_id: '',
      fiscal_year_id: '',
      due_date: '',
      invoice_type: 'student',
      notes: '',
      services: [{
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0
      }]
    }
  });

  // Check permissions
  if (!hasRole(['admin', 'finance', 'hr'])) {
    return null;
  }

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV${year}${random}`;
  };

  const addServiceLine = () => {
    const newLine: InvoiceServiceLine = {
      id: Date.now().toString(),
      service_type_id: '',
      fee_type_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      tax_rate: 0,
      tax_amount: 0
    };
    setServiceLines([...serviceLines, newLine]);
  };

  const removeServiceLine = (id: string) => {
    if (serviceLines.length > 1) {
      setServiceLines(serviceLines.filter(line => line.id !== id));
    }
  };

  const updateServiceLine = (id: string, field: keyof InvoiceServiceLine, value: any) => {
    setServiceLines(prev => prev.map(line => {
      if (line.id === id) {
        const updatedLine = { ...line, [field]: value };
        
        // Auto-update fields when service type changes
        if (field === 'service_type_id') {
          const serviceType = serviceTypes.find(st => st.id === value);
          if (serviceType) {
            updatedLine.description = serviceType.description || serviceType.name;
            updatedLine.unit_price = serviceType.default_price || 0;
            updatedLine.tax_rate = serviceType.is_taxable ? 20 : 0; // 20% TVA by default
          }
        }
        
        // Auto-update fields when fee type changes
        if (field === 'fee_type_id') {
          const feeType = feeTypes.find(ft => ft.id === value);
          if (feeType && feeType.default_amount) {
            if (feeType.is_percentage) {
              updatedLine.tax_rate = feeType.default_amount;
            } else {
              updatedLine.unit_price = feeType.default_amount;
            }
          }
        }
        
        // Recalculate totals when quantity or unit_price changes
        if (field === 'quantity' || field === 'unit_price' || field === 'tax_rate') {
          const subtotal = updatedLine.quantity * updatedLine.unit_price;
          updatedLine.tax_amount = (subtotal * updatedLine.tax_rate) / 100;
          updatedLine.total_price = subtotal + updatedLine.tax_amount;
        }
        
        return updatedLine;
      }
      return line;
    }));
  };

  const calculateTotals = () => {
    const subtotal = serviceLines.reduce((sum, line) => sum + (line.quantity * line.unit_price), 0);
    const tax_amount = serviceLines.reduce((sum, line) => sum + line.tax_amount, 0);
    const total_amount = subtotal + tax_amount;
    
    return { subtotal, tax_amount, total_amount };
  };

  const handleSubmit = async (data: InvoiceFormData) => {
    // Double-check permissions
    if (!hasRole(['admin', 'finance', 'hr'])) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour créer une facture",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { subtotal, tax_amount, total_amount } = calculateTotals();
      
      const invoiceData = {
        student_id: data.student_id,
        fiscal_year_id: data.fiscal_year_id,
        due_date: data.due_date,
        recipient_name: data.recipient_name,
        recipient_email: data.recipient_email,
        recipient_address: data.recipient_address,
        invoice_type: data.invoice_type,
        notes: data.notes,
        invoice_number: generateInvoiceNumber(),
        subtotal,
        tax_amount,
        total_amount
      };

      await createInvoice(invoiceData);
      
      toast({
        title: "Succès",
        description: "Facture créée avec succès"
      });
      
      // Reset form
      form.reset();
      setServiceLines([{
        id: '1',
        service_type_id: '',
        fee_type_id: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0,
        tax_rate: 0,
        tax_amount: 0
      }]);
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la facture",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax_amount, total_amount } = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[rgb(245,158,11)]" />
            Nouvelle facture étudiant
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Étudiant</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un étudiant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.profile.full_name} - {student.student_number}
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
                name="fiscal_year_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année fiscale</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner l'année fiscale" />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          {/* Lignes de services */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Services et frais</h3>
              <Button type="button" onClick={addServiceLine} variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter une ligne
              </Button>
            </div>

            <div className="space-y-3">
              {serviceLines.map((line, index) => (
                <div key={line.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg">
                  <div className="col-span-2">
                    <Label className="text-xs">Type de service</Label>
                    <Select
                      value={line.service_type_id}
                      onValueChange={(value) => updateServiceLine(line.id, 'service_type_id', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-xs">Type de frais</Label>
                    <Select
                      value={line.fee_type_id}
                      onValueChange={(value) => updateServiceLine(line.id, 'fee_type_id', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Frais" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeTypes.map((fee) => (
                          <SelectItem key={fee.id} value={fee.id}>
                            {fee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={line.description}
                      onChange={(e) => updateServiceLine(line.id, 'description', e.target.value)}
                      placeholder="Description..."
                      className="h-8"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label className="text-xs">Qté</Label>
                    <Input
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(e) => updateServiceLine(line.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="h-8"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label className="text-xs">Prix unitaire</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={line.unit_price}
                      onChange={(e) => updateServiceLine(line.id, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label className="text-xs">TVA %</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={line.tax_rate}
                      onChange={(e) => updateServiceLine(line.id, 'tax_rate', parseFloat(e.target.value) || 0)}
                      className="h-8"
                    />
                  </div>

                  <div className="col-span-1">
                    <Label className="text-xs">Total</Label>
                    <Input
                      value={line.total_price.toFixed(2)}
                      readOnly
                      className="h-8 bg-muted"
                    />
                  </div>

                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeServiceLine(line.id)}
                      disabled={serviceLines.length === 1}
                      className="h-8"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totaux */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label>Sous-total</Label>
              <div className="text-lg font-semibold">€{subtotal.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <Label>TVA</Label>
              <div className="text-lg font-semibold">€{tax_amount.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <div className="text-xl font-bold text-[rgb(245,158,11)]">€{total_amount.toFixed(2)}</div>
            </div>
          </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes facultatives..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90"
              >
                {loading ? 'Création...' : 'Créer la facture'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}