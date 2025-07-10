import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';

interface NewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (eventData: any) => Promise<void>;
}

export function NewEventModal({ open, onOpenChange, onSave }: NewEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: '',
    capacity: '',
    registrationRequired: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: '',
        capacity: '',
        registrationRequired: false
      });
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Créer un nouvel événement
          </DialogTitle>
          <DialogDescription>
            Ajoutez les détails de votre événement pour informer la communauté.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'événement *</Label>
              <Input
                id="title"
                placeholder="Ex: Portes ouvertes"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d'événement *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="academic">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Académique
                    </div>
                  </SelectItem>
                  <SelectItem value="ceremony">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Cérémonie
                    </div>
                  </SelectItem>
                  <SelectItem value="training">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Formation
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre événement..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Heure *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Capacité
              </Label>
              <Input
                id="capacity"
                type="number"
                placeholder="Nombre max"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lieu *
            </Label>
            <Input
              id="location"
              placeholder="Ex: Amphithéâtre A, Campus principal"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="registrationRequired"
              checked={formData.registrationRequired}
              onChange={(e) => handleInputChange('registrationRequired', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="registrationRequired">
              Inscription obligatoire
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'événement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}