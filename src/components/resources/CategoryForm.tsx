import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { AssetCategory } from '@/hooks/resources/useAssetCategories';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: AssetCategory;
  mode: 'create' | 'edit' | 'view';
  onSave?: (data: Partial<AssetCategory>) => Promise<void>;
}

export function CategoryForm({ isOpen, onClose, category, mode, onSave }: CategoryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: category?.name || '',
    code: category?.code || '',
    description: category?.description || '',
    is_active: category?.is_active ?? true
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom et le code sont requis",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const data: Partial<AssetCategory> = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        is_active: formData.is_active
      };

      if (onSave) {
        await onSave(data);
      } else {
        toast({
          title: "Succès",
          description: `Catégorie ${mode === 'create' ? 'créée' : 'modifiée'} avec succès`,
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nouvelle catégorie'}
            {mode === 'edit' && 'Modifier la catégorie'}
            {mode === 'view' && 'Détails de la catégorie'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la catégorie *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Informatique, Audiovisuel..."
              disabled={isReadOnly}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              placeholder="Ex: INFO, AV..."
              disabled={isReadOnly}
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de la catégorie..."
              rows={3}
              disabled={isReadOnly}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Catégorie active</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange('is_active', checked)}
              disabled={isReadOnly}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
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