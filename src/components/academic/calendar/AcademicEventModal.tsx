
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { AcademicEvent } from '@/hooks/useAcademicEvents';

interface AcademicEventModalProps {
  open: boolean;
  onClose: () => void;
  event?: AcademicEvent;
  onSave: (eventData: any) => Promise<{ success: boolean; error?: string }>;
  academicYearId?: string;
}

const EVENT_TYPES = [
  { value: 'semester_start', label: 'Début de semestre' },
  { value: 'semester_end', label: 'Fin de semestre' },
  { value: 'exam_period', label: 'Période d\'examens' },
  { value: 'holiday', label: 'Vacances' },
  { value: 'registration', label: 'Inscription' },
  { value: 'deadline', label: 'Échéance' },
  { value: 'orientation', label: 'Orientation' },
  { value: 'graduation', label: 'Remise de diplômes' },
  { value: 'conference', label: 'Conférence' },
  { value: 'other', label: 'Autre' }
];

export function AcademicEventModal({ 
  open, 
  onClose, 
  event, 
  onSave, 
  academicYearId 
}: AcademicEventModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    event_type: 'other',
    start_date: '',
    end_date: '',
    is_holiday: false,
    affects_programs: [] as string[],
    academic_year_id: academicYearId || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description || '',
        event_type: event.event_type,
        start_date: event.start_date,
        end_date: event.end_date,
        is_holiday: event.is_holiday,
        affects_programs: event.affects_programs || [],
        academic_year_id: event.academic_year_id || academicYearId || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        event_type: 'other',
        start_date: '',
        end_date: '',
        is_holiday: false,
        affects_programs: [],
        academic_year_id: academicYearId || ''
      });
    }
  }, [event, academicYearId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast({
        title: "Erreur",
        description: "La date de début doit être antérieure à la date de fin",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await onSave(formData);
    
    if (result.success) {
      toast({
        title: "Succès",
        description: event ? "Événement modifié avec succès" : "Événement créé avec succès"
      });
      onClose();
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Modifier l\'événement' : 'Nouvel événement académique'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'événement *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom de l'événement"
              required
            />
          </div>

          <div>
            <Label htmlFor="event_type">Type d'événement</Label>
            <Select 
              value={formData.event_type} 
              onValueChange={(value) => setFormData({ ...formData, event_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Date de début *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">Date de fin *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description de l'événement"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_holiday"
              checked={formData.is_holiday}
              onCheckedChange={(checked) => setFormData({ ...formData, is_holiday: checked })}
            />
            <Label htmlFor="is_holiday">Période de vacances</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : (event ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
