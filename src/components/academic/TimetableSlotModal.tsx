
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timetable } from '@/hooks/useTimetables';
import { useToast } from '@/hooks/use-toast';
import { SubjectSelector } from './timetable/SubjectSelector';
import { RoomSelector } from './timetable/RoomSelector';
import { TeacherSelector } from './timetable/TeacherSelector';
import { GroupSelector } from './timetable/GroupSelector';

interface TimetableSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  slot?: Timetable | null;
  timeSlot?: { day: number; start: string; end: string } | null;
  programId?: string;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function TimetableSlotModal({ isOpen, onClose, onSave, slot, timeSlot, programId }: TimetableSlotModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject_id: '',
    room_id: '',
    teacher_id: '',
    group_id: '',
    day_of_week: 1,
    start_time: '08:00',
    end_time: '10:00',
    slot_type: 'course',
    status: 'scheduled'
  });

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened with slot:', slot);
      console.log('Modal opened with timeSlot:', timeSlot);
      
      setFormData({
        subject_id: slot?.subject_id || '',
        room_id: slot?.room_id || '',
        teacher_id: slot?.teacher_id || '',
        group_id: slot?.group_id || '',
        day_of_week: timeSlot?.day || slot?.day_of_week || 1,
        start_time: timeSlot?.start || slot?.start_time || '08:00',
        end_time: timeSlot?.end || slot?.end_time || '10:00',
        slot_type: slot?.slot_type || 'course',
        status: slot?.status || 'scheduled'
      });
    }
  }, [isOpen, slot, timeSlot]);

  const validateForm = () => {
    if (!formData.subject_id) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner une matière",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.room_id) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner une salle",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.teacher_id) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un enseignant",
        variant: "destructive"
      });
      return false;
    }

    if (formData.start_time >= formData.end_time) {
      toast({
        title: "Erreur de validation",
        description: "L'heure de fin doit être postérieure à l'heure de début",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Saving timetable slot with data:', formData);
      
      // Préparer les données avec program_id si disponible
      const dataToSave = {
        ...formData,
        group_id: formData.group_id || null,
        program_id: programId || null
      };
      
      await onSave(dataToSave);
      
      toast({
        title: "Succès",
        description: slot ? "Créneau modifié avec succès" : "Créneau créé avec succès"
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving timetable slot:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    console.log(`Changing ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {slot ? 'Modifier le créneau' : 'Nouveau créneau'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Jour de la semaine</Label>
            <Select 
              value={formData.day_of_week.toString()} 
              onValueChange={(value) => handleChange('day_of_week', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Heure de début</Label>
              <Input 
                type="time" 
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
              />
            </div>
            <div>
              <Label>Heure de fin</Label>
              <Input 
                type="time" 
                value={formData.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Type de créneau</Label>
            <Select 
              value={formData.slot_type} 
              onValueChange={(value) => handleChange('slot_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course">Cours</SelectItem>
                <SelectItem value="practical">TP</SelectItem>
                <SelectItem value="exam">Examen</SelectItem>
                <SelectItem value="conference">Conférence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SubjectSelector
            value={formData.subject_id}
            onValueChange={(value) => handleChange('subject_id', value)}
            programId={programId}
          />

          <RoomSelector
            value={formData.room_id}
            onValueChange={(value) => handleChange('room_id', value)}
          />

          <TeacherSelector
            value={formData.teacher_id}
            onValueChange={(value) => handleChange('teacher_id', value)}
          />

          <GroupSelector
            value={formData.group_id}
            onValueChange={(value) => handleChange('group_id', value)}
            programId={programId}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : (slot ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
