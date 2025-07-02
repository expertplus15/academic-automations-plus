import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinanceData } from '@/hooks/useFinanceData';
import { toast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';

interface PaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PaymentForm({ open, onOpenChange, onSuccess }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    student_id: '',
    payment_method_id: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    transaction_reference: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { createPayment } = useFinanceData();

  const generatePaymentNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PAY${year}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentData = {
        ...formData,
        payment_number: generatePaymentNumber(),
        amount: parseFloat(formData.amount),
      };

      await createPayment(paymentData);
      
      // Reset form
      setFormData({
        student_id: '',
        payment_method_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        transaction_reference: '',
        notes: ''
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[rgb(245,158,11)]" />
            Nouveau paiement
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student_id">Étudiant</Label>
            <Select value={formData.student_id} onValueChange={(value) => handleInputChange('student_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student1">Étudiant 1</SelectItem>
                <SelectItem value="student2">Étudiant 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method_id">Méthode de paiement</Label>
            <Select value={formData.payment_method_id} onValueChange={(value) => handleInputChange('payment_method_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="transfer">Virement</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">Date de paiement</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => handleInputChange('payment_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction_reference">Référence de transaction</Label>
            <Input
              id="transaction_reference"
              value={formData.transaction_reference}
              onChange={(e) => handleInputChange('transaction_reference', e.target.value)}
              placeholder="Référence bancaire, numéro de chèque..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes facultatives..."
              rows={3}
            />
          </div>

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
              {loading ? 'Enregistrement...' : 'Enregistrer le paiement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}