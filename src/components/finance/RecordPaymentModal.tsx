import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Calendar } from 'lucide-react';

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  onSuccess: () => void;
}

export function RecordPaymentModal({ open, onOpenChange, invoice, onSuccess }: RecordPaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const { toast } = useToast();

  const remainingAmount = invoice ? (invoice.total_amount - (invoice.paid_amount || 0)) : 0;

  useEffect(() => {
    if (invoice) {
      setAmount(remainingAmount.toString());
    }
  }, [invoice, remainingAmount]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const generatePaymentNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PAY${year}${random}`;
  };

  const handleRecordPayment = async () => {
    if (!amount || !paymentMethod || !invoice.student_id) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const paymentAmount = parseFloat(amount);
      const newPaidAmount = (invoice.paid_amount || 0) + paymentAmount;
      
      // Créer le paiement
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          student_id: invoice.student_id,
          invoice_id: invoice.id,
          payment_method_id: paymentMethod,
          amount: paymentAmount,
          payment_date: paymentDate,
          payment_number: generatePaymentNumber(),
          transaction_reference: reference || null,
          notes: notes || null,
          status: 'completed'
        });

      if (paymentError) throw paymentError;

      // Mettre à jour la facture
      const newStatus = newPaidAmount >= invoice.total_amount ? 'paid' : 
                       newPaidAmount > 0 ? 'partial' : invoice.status;

      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({
          paid_amount: newPaidAmount,
          status: newStatus
        })
        .eq('id', invoice.id);

      if (invoiceError) throw invoiceError;

      toast({
        title: "Paiement enregistré",
        description: `Paiement de €${paymentAmount.toLocaleString()} enregistré avec succès`,
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setPaymentMethod('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setReference('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Enregistrer un Paiement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <h4 className="font-medium">{invoice?.invoice_number}</h4>
            <p className="text-sm text-muted-foreground">
              Montant total: €{invoice?.total_amount?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Déjà payé: €{(invoice?.paid_amount || 0).toLocaleString()}
            </p>
            <p className="text-lg font-semibold text-orange-600">
              Restant dû: €{remainingAmount.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date de paiement *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Mode de paiement *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un mode de paiement" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Référence de transaction</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Numéro de chèque, référence virement..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes supplémentaires..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleRecordPayment}
              disabled={loading}
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer le Paiement'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}