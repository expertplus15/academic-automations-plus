import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface SpecialtyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialty?: any;
  mode: 'create' | 'edit' | 'view';
}

export function SpecialtyFormModal({ isOpen, onClose, specialty, mode }: SpecialtyFormModalProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: specialty?.name || '',
    code: specialty?.code || '',
    description: specialty?.description || '',
    category: specialty?.category || 'technical',
    level_required: specialty?.level_required || 'basic',
    is_active: specialty?.is_active !== false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: mode === 'create' ? "Spécialité créée" : "Spécialité modifiée",
      description: mode === 'create' 
        ? "La nouvelle spécialité a été créée avec succès" 
        : "La spécialité a été modifiée avec succès",
    });
    
    onClose();
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nouvelle Spécialité'}
            {mode === 'edit' && 'Modifier la Spécialité'}
            {mode === 'view' && 'Détails de la Spécialité'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <Label htmlFor="name">Nom de la spécialité *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Développement Web"
              readOnly={isReadOnly}
              required
            />
          </div>

          {/* Code */}
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Ex: DEV-WEB"
              readOnly={isReadOnly}
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technique</SelectItem>
                <SelectItem value="pedagogical">Pédagogique</SelectItem>
                <SelectItem value="research">Recherche</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Niveau requis */}
          <div>
            <Label htmlFor="level_required">Niveau requis *</Label>
            <Select 
              value={formData.level_required} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, level_required: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Débutant</SelectItem>
                <SelectItem value="intermediate">Intermédiaire</SelectItem>
                <SelectItem value="advanced">Avancé</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la spécialité..."
              rows={3}
              readOnly={isReadOnly}
            />
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              disabled={isReadOnly}
            />
            <Label htmlFor="is_active">Spécialité active</Label>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isReadOnly ? 'Fermer' : 'Annuler'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                {mode === 'create' ? 'Créer la spécialité' : 'Enregistrer'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}