
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useEntityValidation() {
  const [isValidating, setIsValidating] = useState(false);

  const validateUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const validateEntityExists = async (table: string, id: string): Promise<boolean> => {
    if (!validateUUID(id)) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .eq('id', id)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  };

  const validateTimetableData = async (data: {
    subject_id: string;
    room_id: string;
    teacher_id: string;
    group_id?: string;
  }) => {
    setIsValidating(true);
    const errors: string[] = [];

    try {
      // Validation des UUIDs
      if (!validateUUID(data.subject_id)) {
        errors.push('L\'ID de la matière n\'est pas un UUID valide');
      }
      if (!validateUUID(data.room_id)) {
        errors.push('L\'ID de la salle n\'est pas un UUID valide');
      }
      if (!validateUUID(data.teacher_id)) {
        errors.push('L\'ID de l\'enseignant n\'est pas un UUID valide');
      }
      if (data.group_id && !validateUUID(data.group_id)) {
        errors.push('L\'ID du groupe n\'est pas un UUID valide');
      }

      if (errors.length > 0) {
        return { isValid: false, errors };
      }

      // Vérification de l'existence des entités
      const [subjectExists, roomExists, teacherExists, groupExists] = await Promise.all([
        validateEntityExists('subjects', data.subject_id),
        validateEntityExists('rooms', data.room_id),
        validateEntityExists('profiles', data.teacher_id),
        data.group_id ? validateEntityExists('class_groups', data.group_id) : true
      ]);

      if (!subjectExists) {
        errors.push('La matière spécifiée n\'existe pas');
      }
      if (!roomExists) {
        errors.push('La salle spécifiée n\'existe pas');
      }
      if (!teacherExists) {
        errors.push('L\'enseignant spécifié n\'existe pas');
      }
      if (data.group_id && !groupExists) {
        errors.push('Le groupe spécifié n\'existe pas');
      }

      return { isValid: errors.length === 0, errors };
    } finally {
      setIsValidating(false);
    }
  };

  const checkTimeConflicts = async (
    day: number,
    startTime: string,
    endTime: string,
    roomId: string,
    teacherId: string,
    academicYearId?: string,
    excludeId?: string
  ) => {
    try {
      const conflicts: string[] = [];

      // Vérifier les conflits de salle
      const { data: roomConflicts } = await supabase
        .from('timetables')
        .select('id, start_time, end_time')
        .eq('day_of_week', day)
        .eq('room_id', roomId)
        .neq('id', excludeId || '')
        .filter('academic_year_id', 'eq', academicYearId || null);

      // Vérifier les conflits d'enseignant
      const { data: teacherConflicts } = await supabase
        .from('timetables')
        .select('id, start_time, end_time')
        .eq('day_of_week', day)
        .eq('teacher_id', teacherId)
        .neq('id', excludeId || '')
        .filter('academic_year_id', 'eq', academicYearId || null);

      // Analyser les conflits horaires
      const hasTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
        return (start1 < end2 && end1 > start2);
      };

      roomConflicts?.forEach(conflict => {
        if (hasTimeOverlap(startTime, endTime, conflict.start_time, conflict.end_time)) {
          conflicts.push(`Conflit de salle : créneau ${conflict.start_time}-${conflict.end_time} déjà occupé`);
        }
      });

      teacherConflicts?.forEach(conflict => {
        if (hasTimeOverlap(startTime, endTime, conflict.start_time, conflict.end_time)) {
          conflicts.push(`Conflit d'enseignant : créneau ${conflict.start_time}-${conflict.end_time} déjà occupé`);
        }
      });

      return { hasConflicts: conflicts.length > 0, conflicts };
    } catch (error) {
      console.error('Erreur lors de la vérification des conflits:', error);
      return { hasConflicts: false, conflicts: [] };
    }
  };

  return {
    isValidating,
    validateTimetableData,
    checkTimeConflicts,
    validateUUID
  };
}
