import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useStudents } from '@/hooks/useStudents';
import { toast } from '@/hooks/use-toast';
import { Calendar, CalendarCheck } from 'lucide-react';

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InvoiceForm({ open, onOpenChange, onSuccess }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    student_id: '',
    fiscal_year_id: '',
    due_date: '',
    subtotal: '',
    tax_amount: '',
    total_amount: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { createInvoice } = useFinanceData();
  const { students } = useStudents();

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV${year}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        ...formData,
        invoice_number: generateInvoiceNumber(),
        subtotal: parseFloat(formData.subtotal) || 0,
        tax_amount: parseFloat(formData.tax_amount) || 0,
        total_amount: parseFloat(formData.total_amount) || 0,
      };

      await createInvoice(invoiceData);
      
      // Reset form
      setFormData({
        student_id: '',
        fiscal_year_id: '',
        due_date: '',
        subtotal: '',
        tax_amount: '',
        total_amount: '',
        notes: ''
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating invoice:', error);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[rgb(245,158,11)]" />
            Nouvelle facture
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
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.profile.full_name} - {student.student_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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
              {loading ? 'Création...' : 'Créer la facture'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}