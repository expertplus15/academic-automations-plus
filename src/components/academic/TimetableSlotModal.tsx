
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timetable } from '@/hooks/useTimetables';
import { useToast } from '@/hooks/use-toast';
import { useEntityValidation } from '@/hooks/useEntityValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

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
  const { validateTimetableData, checkTimeConflicts, isValidating } = useEntityValidation();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [conflictWarnings, setConflictWarnings] = useState<string[]>([]);
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
      
      setValidationErrors([]);
      setConflictWarnings([]);
    }
  }, [isOpen, slot, timeSlot]);

  const validateForm = async () => {
    setValidationErrors([]);
    setConflictWarnings([]);

    // Validation de base
    if (!formData.subject_id || !formData.room_id || !formData.teacher_id) {
      const errors = [];
      if (!formData.subject_id) errors.push('L\'ID de la matière est requis');
      if (!formData.room_id) errors.push('L\'ID de la salle est requis');
      if (!formData.teacher_id) errors.push('L\'ID de l\'enseignant est requis');
      setValidationErrors(errors);
      return false;
    }

    if (formData.start_time >= formData.end_time) {
      setValidationErrors(['L\'heure de fin doit être postérieure à l\'heure de début']);
      return false;
    }

    // Validation des entités
    console.log('Validation des entités...', formData);
    const validation = await validateTimetableData({
      subject_id: formData.subject_id,
      room_id: formData.room_id,
      teacher_id: formData.teacher_id,
      group_id: formData.group_id || undefined
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }

    // Vérification des conflits
    console.log('Vérification des conflits...');
    const conflictCheck = await checkTimeConflicts(
      formData.day_of_week,
      formData.start_time,
      formData.end_time,
      formData.room_id,
      formData.teacher_id,
      undefined, // academic_year_id
      slot?.id // exclure le créneau actuel en cas de modification
    );

    if (conflictCheck.hasConflicts) {
      setConflictWarnings(conflictCheck.conflicts);
      // Les conflits sont des avertissements, pas des erreurs bloquantes
    }

    return true;
  };

  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) {
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
    
    // Réinitialiser les erreurs lors des changements
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    if (conflictWarnings.length > 0) {
      setConflictWarnings([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {slot ? 'Modifier le créneau' : 'Nouveau créneau'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Affichage des erreurs de validation */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Affichage des avertissements de conflit */}
          {conflictWarnings.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-1">Conflits détectés :</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {conflictWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

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

          <div>
            <Label>ID Matière *</Label>
            <Input
              value={formData.subject_id}
              onChange={(e) => handleChange('subject_id', e.target.value)}
              placeholder="ex: 123e4567-e89b-12d3-a456-426614174000"
            />
          </div>

          <div>
            <Label>ID Salle *</Label>
            <Input
              value={formData.room_id}
              onChange={(e) => handleChange('room_id', e.target.value)}
              placeholder="ex: 123e4567-e89b-12d3-a456-426614174000"
            />
          </div>

          <div>
            <Label>ID Enseignant *</Label>
            <Input
              value={formData.teacher_id}
              onChange={(e) => handleChange('teacher_id', e.target.value)}
              placeholder="ex: 123e4567-e89b-12d3-a456-426614174000"
            />
          </div>

          <div>
            <Label>ID Groupe</Label>
            <Input
              value={formData.group_id}
              onChange={(e) => handleChange('group_id', e.target.value)}
              placeholder="ex: 123e4567-e89b-12d3-a456-426614174000 (optionnel)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading || isValidating}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || isValidating}
              className="min-w-[100px]"
            >
              {isLoading || isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isValidating ? 'Validation...' : 'Sauvegarde...'}
                </>
              ) : (
                slot ? 'Modifier' : 'Créer'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
