import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useTeacherProfiles } from '@/hooks/hr/useTeacherProfiles';

interface AvailabilityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  availability?: any;
  mode: 'create' | 'edit' | 'view';
}

export function AvailabilityFormModal({ isOpen, onClose, availability, mode }: AvailabilityFormModalProps) {
  const { toast } = useToast();
  const { teacherProfiles } = useTeacherProfiles();
  
  const [formData, setFormData] = useState({
    teacher_id: availability?.teacher_id || '',
    availability_type: availability?.availability_type || 'available',
    day_of_week: availability?.day_of_week || '',
    specific_date: availability?.specific_date ? new Date(availability.specific_date) : undefined,
    start_time: availability?.start_time || '',
    end_time: availability?.end_time || '',
    is_recurring: availability?.is_recurring || false,
    max_hours_per_day: availability?.max_hours_per_day || '',
    max_hours_per_week: availability?.max_hours_per_week || '',
    notes: availability?.notes || ''
  });

  const [specificDate, setSpecificDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: mode === 'create' ? "Disponibilité créée" : "Disponibilité modifiée",
      description: mode === 'create' 
        ? "La nouvelle disponibilité a été créée avec succès" 
        : "La disponibilité a été modifiée avec succès",
    });
    
    onClose();
  };

  const isReadOnly = mode === 'view';

  const daysOfWeek = [
    { value: '1', label: 'Lundi' },
    { value: '2', label: 'Mardi' },
    { value: '3', label: 'Mercredi' },
    { value: '4', label: 'Jeudi' },
    { value: '5', label: 'Vendredi' },
    { value: '6', label: 'Samedi' },
    { value: '0', label: 'Dimanche' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nouvelle Disponibilité'}
            {mode === 'edit' && 'Modifier la Disponibilité'}
            {mode === 'view' && 'Détails de la Disponibilité'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enseignant */}
          <div>
            <Label htmlFor="teacher_id">Enseignant *</Label>
            <Select 
              value={formData.teacher_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, teacher_id: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un enseignant" />
              </SelectTrigger>
              <SelectContent>
                {teacherProfiles.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.profile?.full_name} ({teacher.employee_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type de disponibilité */}
          <div>
            <Label htmlFor="availability_type">Type de disponibilité *</Label>
            <Select 
              value={formData.availability_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, availability_type: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="unavailable">Indisponible</SelectItem>
                <SelectItem value="preferred">Préféré</SelectItem>
                <SelectItem value="limited">Limité</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Récurrent */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_recurring"
              checked={formData.is_recurring}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_recurring: checked }))}
              disabled={isReadOnly}
            />
            <Label htmlFor="is_recurring">Disponibilité récurrente</Label>
          </div>

          {/* Jour de la semaine ou date spécifique */}
          {formData.is_recurring ? (
            <div>
              <Label htmlFor="day_of_week">Jour de la semaine *</Label>
              <Select 
                value={formData.day_of_week} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: value }))}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un jour" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label>Date spécifique *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isReadOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {specificDate ? format(specificDate, "dd/MM/yyyy", { locale: fr }) : "Sélectionner..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={specificDate}
                    onSelect={setSpecificDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Horaires */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Heure de début *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="end_time">Heure de fin *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Limitations horaires */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_hours_per_day">Max heures/jour</Label>
              <Input
                id="max_hours_per_day"
                type="number"
                value={formData.max_hours_per_day}
                onChange={(e) => setFormData(prev => ({ ...prev, max_hours_per_day: e.target.value }))}
                placeholder="0"
                min="0"
                max="24"
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="max_hours_per_week">Max heures/semaine</Label>
              <Input
                id="max_hours_per_week"
                type="number"
                value={formData.max_hours_per_week}
                onChange={(e) => setFormData(prev => ({ ...prev, max_hours_per_week: e.target.value }))}
                placeholder="0"
                min="0"
                max="168"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes additionnelles..."
              rows={3}
              readOnly={isReadOnly}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isReadOnly ? 'Fermer' : 'Annuler'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                {mode === 'create' ? 'Créer la disponibilité' : 'Enregistrer'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}