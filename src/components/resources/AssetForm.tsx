import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Asset } from '@/hooks/resources/useAssets';

interface AssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: Asset;
  mode: 'create' | 'edit' | 'view';
  onSave?: (data: Partial<Asset>) => Promise<void>;
}

export function AssetForm({ isOpen, onClose, asset, mode, onSave }: AssetFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: asset?.name || '',
    description: asset?.description || '',
    brand: asset?.brand || '',
    model: asset?.model || '',
    location: asset?.location || '',
    status: asset?.status || 'active',
    condition_status: asset?.condition_status || 'good'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de l'équipement est requis",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (onSave) {
        await onSave(formData as Partial<Asset>);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nouvel équipement'}
            {mode === 'edit' && 'Modifier l\'équipement'}
            {mode === 'view' && 'Détails de l\'équipement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                disabled={isReadOnly}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
                disabled={isReadOnly}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              disabled={isReadOnly}
            />
          </div>

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