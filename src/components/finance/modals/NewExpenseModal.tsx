import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useExpenses } from '@/hooks/finance/useExpenses';
import { useToast } from '@/hooks/use-toast';
import { Receipt, Building, Users, BookOpen, Zap } from 'lucide-react';

interface NewExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewExpenseModal({ open, onOpenChange }: NewExpenseModalProps) {
  const { createExpense } = useExpenses();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    supplier_id: '',
    financial_category_id: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
    receipt_url: ''
  });

  // Mock data - à remplacer par les vraies données
  const suppliers = [
    { id: '1', name: 'TechnoSoft Solutions' },
    { id: '2', name: 'Papeterie Centrale' },
    { id: '3', name: 'Maintenance Pro' },
    { id: '4', name: 'Formation Expert' }
  ];

  const categories = [
    { id: '1', name: 'Personnel & Salaires', icon: Users },
    { id: '2', name: 'Équipements & Infrastructure', icon: Building },
    { id: '3', name: 'Fournitures Pédagogiques', icon: BookOpen },
    { id: '4', name: 'Services & Maintenance', icon: Zap },
    { id: '5', name: 'Frais Généraux', icon: Receipt }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createExpense({
        supplier_id: formData.supplier_id,
        financial_category_id: formData.financial_category_id,
        amount: parseFloat(formData.amount),
        expense_date: formData.expense_date,
        description: formData.description,
        receipt_url: formData.receipt_url,
        approval_status: 'pending',
        fiscal_year_id: '00000000-0000-0000-0000-000000000000' // À récupérer dynamiquement
      });

      toast({
        title: "Succès",
        description: "Dépense enregistrée avec succès",
      });

      onOpenChange(false);
      setFormData({
        supplier_id: '',
        financial_category_id: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        description: '',
        receipt_url: ''
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la dépense",
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
            <Receipt className="w-5 h-5 text-red-500" />
            Nouvelle Dépense
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="supplier">Fournisseur</Label>
            <Select value={formData.supplier_id} onValueChange={(value) => setFormData({...formData, supplier_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.financial_category_id} onValueChange={(value) => setFormData({...formData, financial_category_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {category.name}
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
            <Label htmlFor="date">Date de dépense</Label>
            <Input
              id="date"
              type="date"
              value={formData.expense_date}
              onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description de la dépense..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="receipt">URL du reçu</Label>
            <Input
              id="receipt"
              placeholder="https://..."
              value={formData.receipt_url}
              onChange={(e) => setFormData({...formData, receipt_url: e.target.value})}
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