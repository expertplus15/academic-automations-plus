import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useProcurementRequests } from '@/hooks/resources/useProcurementRequests';
import { useAssetCategories } from '@/hooks/resources/useAssetCategories';
import { useToast } from '@/hooks/use-toast';
import { procurementRequestSchema, type ProcurementRequestFormData } from '@/lib/validations/resources';
import { cn } from '@/lib/utils';

interface ProcurementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProcurementFormModal({ isOpen, onClose, onSuccess }: ProcurementFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    quantity: 1,
    unit_price: '',
    total_amount: '',
    justification: '',
    priority: 'medium',
    expected_delivery_date: undefined as Date | undefined,
    supplier_preference: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createRequest } = useProcurementRequests();
  const { categories } = useAssetCategories();
  const { toast } = useToast();

  // Calculate total amount when unit price or quantity changes
  React.useEffect(() => {
    const unitPrice = parseFloat(formData.unit_price) || 0;
    const quantity = formData.quantity || 0;
    const total = unitPrice * quantity;
    setFormData(prev => ({ ...prev, total_amount: total.toFixed(2) }));
  }, [formData.unit_price, formData.quantity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validation with Zod
      const validatedData = procurementRequestSchema.parse({
        ...formData,
        unit_price: parseFloat(formData.unit_price),
        total_amount: parseFloat(formData.total_amount)
      });

      await createRequest({
        ...validatedData,
        expected_delivery_date: validatedData.expected_delivery_date?.toISOString().split('T')[0]
      });
      
      toast({
        title: "Succès",
        description: "Demande d'achat créée avec succès",
      });

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category_id: '',
        quantity: 1,
        unit_price: '',
        total_amount: '',
        justification: '',
        priority: 'medium',
        expected_delivery_date: undefined,
        supplier_preference: ''
      });
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle demande d'achat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">Titre de la demande *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Ordinateurs portables pour salle informatique"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Catégorie *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_price">Prix unitaire (€) *</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData(prev => ({ ...prev, unit_price: e.target.value }))}
                placeholder="0.00"
                className={errors.unit_price ? 'border-red-500' : ''}
              />
              {errors.unit_price && <p className="text-sm text-red-500">{errors.unit_price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_amount">Montant total (€)</Label>
              <Input
                id="total_amount"
                value={formData.total_amount}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Date de livraison souhaitée</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expected_delivery_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expected_delivery_date ? (
                      format(formData.expected_delivery_date, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expected_delivery_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, expected_delivery_date: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_preference">Fournisseur préféré</Label>
              <Input
                id="supplier_preference"
                value={formData.supplier_preference}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier_preference: e.target.value }))}
                placeholder="Nom du fournisseur (optionnel)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description détaillée *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrire précisément les articles à acheter, spécifications techniques, etc."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justification *</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              placeholder="Justifier le besoin et l'urgence de cet achat..."
              rows={3}
              className={errors.justification ? 'border-red-500' : ''}
            />
            {errors.justification && <p className="text-sm text-red-500">{errors.justification}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Créer la demande
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}