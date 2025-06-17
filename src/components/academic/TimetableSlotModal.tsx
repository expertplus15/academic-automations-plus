import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Timetable } from '@/hooks/useTimetables';
import { useToast } from '@/hooks/use-toast';
import { useEntityValidation } from '@/hooks/useEntityValidation';
import { useTimetableSlotForm } from './timetable/useTimetableSlotForm';
import { TimetableValidationAlerts } from './timetable/TimetableValidationAlerts';
import { TimetableSlotFormFields } from './timetable/TimetableSlotFormFields';
import { TimetableSlotModalActions } from './timetable/TimetableSlotModalActions';

interface TimetableSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  slot?: Timetable | null;
  timeSlot?: { day: number; start: string; end: string } | null;
  programId?: string;
  academicYearId?: string;
}

export function TimetableSlotModal({ 
  isOpen, 
  onClose, 
  onSave, 
  slot, 
  timeSlot, 
  programId,
  academicYearId
}: TimetableSlotModalProps) {
  const { toast } = useToast();
  const { validateTimetableData, checkTimeConflicts, isValidating } = useEntityValidation();
  const { formData, handleChange } = useTimetableSlotForm(isOpen, slot, timeSlot);
  
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [conflictWarnings, setConflictWarnings] = useState<string[]>([]);

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
      academicYearId,
      slot?.id
    );

    if (conflictCheck.hasConflicts) {
      setConflictWarnings(conflictCheck.conflicts);
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
      
      const dataToSave = {
        ...formData,
        group_id: formData.group_id || null,
        program_id: programId || null,
        academic_year_id: academicYearId || null
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

  const handleFieldChange = (field: string, value: any) => {
    handleChange(field, value);
    
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
          <TimetableValidationAlerts
            validationErrors={validationErrors}
            conflictWarnings={conflictWarnings}
          />

          <TimetableSlotFormFields
            formData={formData}
            onChange={handleFieldChange}
            programId={programId}
            academicYearId={academicYearId}
          />

          <TimetableSlotModalActions
            isLoading={isLoading}
            isValidating={isValidating}
            isEditing={!!slot}
            onClose={onClose}
            onSave={handleSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
