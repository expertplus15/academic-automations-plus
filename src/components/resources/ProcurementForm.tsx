import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ProcurementRequest } from '@/hooks/resources/useProcurement';
import { Plus, Trash2 } from 'lucide-react';

interface ProcurementFormProps {
  isOpen: boolean;
  onClose: () => void;
  request?: ProcurementRequest;
  mode: 'create' | 'edit' | 'view';
  onSave?: (data: Partial<ProcurementRequest>) => Promise<void>;
}

interface RequestItem {
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export function ProcurementForm({ isOpen, onClose, request, mode, onSave }: ProcurementFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: request?.title || '',
    description: request?.description || '',
    priority: request?.priority || 'medium',
    delivery_date: request?.delivery_date?.split('T')[0] || '',
    estimated_cost: request?.estimated_cost || 0
  });

  const [items, setItems] = useState<RequestItem[]>(
    request?.items || [{ name: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }]
  );

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total price if quantity or unit_price changed
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setItems(newItems);
    
    // Update estimated cost
    const totalCost = newItems.reduce((sum, item) => sum + item.total_price, 0);
    setFormData(prev => ({ ...prev, estimated_cost: totalCost }));
  };

  const addItem = () => {
    setItems([...items, { name: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      
      // Update estimated cost
      const totalCost = newItems.reduce((sum, item) => sum + item.total_price, 0);
      setFormData(prev => ({ ...prev, estimated_cost: totalCost }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de la demande est requis",
        variant: "destructive",
      });
      return;
    }

    if (items.some(item => !item.name.trim())) {
      toast({
        title: "Erreur",
        description: "Tous les articles doivent avoir un nom",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const data: Partial<ProcurementRequest> = {
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority as ProcurementRequest['priority'],
        delivery_date: formData.delivery_date || null,
        estimated_cost: formData.estimated_cost,
        items: items.filter(item => item.name.trim())
      };

      if (onSave) {
        await onSave(data);
      } else {
        toast({
          title: "Succès",
          description: `Demande ${mode === 'create' ? 'créée' : 'modifiée'} avec succès`,
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nouvelle demande d\'approvisionnement'}
            {mode === 'edit' && 'Modifier la demande'}
            {mode === 'view' && 'Détails de la demande'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la demande *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ex: Ordinateurs pour laboratoire"
                    disabled={isReadOnly}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleChange('priority', value)}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery_date">Date de livraison souhaitée</Label>
                  <Input
                    id="delivery_date"
                    type="date"
                    value={formData.delivery_date}
                    onChange={(e) => handleChange('delivery_date', e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Coût estimé (€)</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={formData.estimated_cost}
                    disabled={true}
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Description détaillée de la demande..."
                  rows={3}
                  disabled={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* Articles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Articles demandés</CardTitle>
                {!isReadOnly && (
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un article
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Nom de l'article *</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="Ex: Ordinateur portable"
                      disabled={isReadOnly}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      disabled={isReadOnly}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prix unitaire (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Total (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.total_price.toFixed(2)}
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    {!isReadOnly && items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <Label>Description (optionnel)</Label>
                    <Input
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Description détaillée de l'article..."
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Fermer' : 'Annuler'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sauvegarde...' : mode === 'create' ? 'Créer' : 'Modifier'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}