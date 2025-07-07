import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { usePayments } from '@/hooks/finance/usePayments';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Banknote, Smartphone, ArrowUpDown } from 'lucide-react';

interface NewPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPaymentModal({ open, onOpenChange }: NewPaymentModalProps) {
  const { createPayment } = usePayments();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    student_id: '',
    payment_method_id: '',
    amount: '',
    transaction_reference: '',
    notes: ''
  });

  // Mock data - à remplacer par les vraies données
  const paymentMethods = [
    { id: '1', name: 'Carte Bancaire', icon: CreditCard },
    { id: '2', name: 'Virement SEPA', icon: ArrowUpDown },
    { id: '3', name: 'Prélèvement', icon: Banknote },
    { id: '4', name: 'Paiement Mobile', icon: Smartphone }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPayment({
        student_id: formData.student_id,
        payment_method_id: formData.payment_method_id,
        payment_number: `PAY-${Date.now()}`, // Généré automatiquement
        amount: parseFloat(formData.amount),
        transaction_reference: formData.transaction_reference,
        notes: formData.notes
      });

      toast({
        title: "Succès",
        description: "Paiement enregistré avec succès",
      });

      onOpenChange(false);
      setFormData({
        student_id: '',
        payment_method_id: '',
        amount: '',
        transaction_reference: '',
        notes: ''
      });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-500" />
            Nouveau Paiement
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">Étudiant</Label>
            <Input
              id="student"
              placeholder="Rechercher un étudiant..."
              value={formData.student_id}
              onChange={(e) => setFormData({...formData, student_id: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="payment_method">Mode de paiement</Label>
            <Select value={formData.payment_method_id} onValueChange={(value) => setFormData({...formData, payment_method_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {method.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Montant (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="reference">Référence transaction</Label>
            <Input
              id="reference"
              placeholder="Référence bancaire..."
              value={formData.transaction_reference}
              onChange={(e) => setFormData({...formData, transaction_reference: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Informations complémentaires..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}