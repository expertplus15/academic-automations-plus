import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinanceData } from '@/hooks/useFinanceData';
import { toast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';

interface FreeInvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function FreeInvoiceForm({ open, onOpenChange, onSuccess }: FreeInvoiceFormProps) {
  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_email: '',
    recipient_address: '',
    fiscal_year_id: '',
    due_date: '',
    subtotal: '',
    tax_amount: '',
    total_amount: '',
    description: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { createInvoice } = useFinanceData();

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `LIBRE${year}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        invoice_number: generateInvoiceNumber(),
        fiscal_year_id: formData.fiscal_year_id,
        due_date: formData.due_date,
        subtotal: parseFloat(formData.subtotal) || 0,
        tax_amount: parseFloat(formData.tax_amount) || 0,
        total_amount: parseFloat(formData.total_amount) || 0,
        notes: `Facture libre - ${formData.recipient_name}\nEmail: ${formData.recipient_email}\nAdresse: ${formData.recipient_address}\n\nDescription: ${formData.description}\n\nNotes: ${formData.notes}`,
        // Pour les factures libres, on utilise null pour student_id
        student_id: null
      };

      await createInvoice(invoiceData);
      
      toast({
        title: "Facture libre créée",
        description: `Facture ${invoiceData.invoice_number} créée avec succès`,
      });
      
      // Reset form
      setFormData({
        recipient_name: '',
        recipient_email: '',
        recipient_address: '',
        fiscal_year_id: '',
        due_date: '',
        subtotal: '',
        tax_amount: '',
        total_amount: '',
        description: '',
        notes: ''
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating free invoice:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture libre",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate total when subtotal or tax changes
      if (field === 'subtotal' || field === 'tax_amount') {
        const subtotal = parseFloat(field === 'subtotal' ? value : prev.subtotal) || 0;
        const tax = parseFloat(field === 'tax_amount' ? value : prev.tax_amount) || 0;
        newData.total_amount = (subtotal + tax).toString();
      }
      
      return newData;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
            Nouvelle facture libre
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informations destinataire */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-sm">Informations destinataire</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipient_name">Nom du destinataire</Label>
                <Input
                  id="recipient_name"
                  value={formData.recipient_name}
                  onChange={(e) => handleInputChange('recipient_name', e.target.value)}
                  required
                  placeholder="Nom complet ou entreprise"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient_email">Email</Label>
                <Input
                  id="recipient_email"
                  type="email"
                  value={formData.recipient_email}
                  onChange={(e) => handleInputChange('recipient_email', e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient_address">Adresse de facturation</Label>
              <Textarea
                id="recipient_address"
                value={formData.recipient_address}
                onChange={(e) => handleInputChange('recipient_address', e.target.value)}
                placeholder="Adresse complète..."
                rows={3}
              />
            </div>
          </div>

          {/* Informations facture */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscal_year_id">Année fiscale</Label>
              <Select value={formData.fiscal_year_id} onValueChange={(value) => handleInputChange('fiscal_year_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'année fiscale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Date d'échéance</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description des services/produits</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez les services ou produits facturés..."
              rows={4}
              required
            />
          </div>

          {/* Montants */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">Sous-total (€)</Label>
              <Input
                id="subtotal"
                type="number"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => handleInputChange('subtotal', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_amount">TVA (€)</Label>
              <Input
                id="tax_amount"
                type="number"
                step="0.01"
                value={formData.tax_amount}
                onChange={(e) => handleInputChange('tax_amount', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_amount">Total (€)</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => handleInputChange('total_amount', e.target.value)}
                required
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires</Label>
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
              {loading ? 'Création...' : 'Créer la facture libre'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}