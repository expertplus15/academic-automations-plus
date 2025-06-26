
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  violations: Violation[];
  summary: string;
}

export interface Violation {
  type: string;
  message: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const validateExamSchedule = async (examData: any): Promise<ValidationResult> => {
  try {
    const violations: Violation[] = [];

    for (const session of examData.exam_sessions || []) {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);

      if (start >= end) {
        violations.push({
          type: 'invalid_time',
          message: `Session ${session.id}: Heure de début après heure de fin`,
          sessionId: session.id,
          severity: 'high'
        });
      }

      if (start.getDay() === 0 || start.getDay() === 6) {
        violations.push({
          type: 'weekend_session',
          message: `Session ${session.id}: L'examen ne peut pas avoir lieu le week-end`,
          sessionId: session.id,
          severity: 'medium'
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      summary: `${violations.length} violation(s) d'horaire détectée(s)`
    };
  } catch (error) {
    console.error('Erreur validation horaire:', error);
    return {
      isValid: false,
      violations: [],
      summary: 'Erreur lors de la validation des horaires'
    };
  }
};

export const validateCapacityConstraints = async (examData: any): Promise<ValidationResult> => {
  try {
    const violations = [];

    for (const session of examData.exam_sessions || []) {
      if (!session.room_id) continue;

      // Récupérer les informations de la salle
      const { data: room } = await supabase
        .from('rooms')
        .select('capacity, name')
        .eq('id', session.room_id)
        .single();

      if (!room) continue;

      // Compter les étudiants inscrits
      const { data: registrations } = await supabase
        .from('exam_registrations')
        .select('id')
        .eq('session_id', session.id)
        .eq('status', 'registered');

      const studentCount = registrations?.length || 0;

      if (studentCount > room.capacity) {
        violations.push({
          type: 'capacity_exceeded',
          message: `Salle ${room.name}: ${studentCount} étudiants pour ${room.capacity} places`,
          sessionId: session.id,
          severity: 'critical'
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      summary: `${violations.length} violation(s) de capacité détectée(s)`
    };
  } catch (error) {
    console.error('Erreur validation capacité:', error);
    return {
      isValid: false,
      violations: [],
      summary: 'Erreur lors de la validation des capacités'
    };
  }
};

export const validateExamTypeConstraints = async (examData: any): Promise<ValidationResult> => {
  try {
    const violations = [];

    for (const session of examData.exam_sessions || []) {
      if (!session.room_id) continue;

      // Récupérer les informations de la salle
      const { data: room } = await supabase
        .from('rooms')
        .select('room_type, equipment, name')
        .eq('id', session.room_id)
        .single();

      if (!room) continue;

      // Vérifier la compatibilité du type d'examen avec la salle
      const examType = examData.exam_type;
      const isCompatible = checkRoomExamTypeCompatibility(room, examType);

      if (!isCompatible) {
        violations.push({
          type: 'room_type_incompatible',
          message: `Salle ${room.name} (${room.room_type}) incompatible avec examen ${examType}`,
          sessionId: session.id,
          severity: 'high'
        });
      }

      // Vérifier les équipements requis
      const requiredEquipment = examData.materials_required || [];
      if (Array.isArray(requiredEquipment) && requiredEquipment.length > 0) {
        const roomEquipment = Array.isArray(room.equipment) ? room.equipment : [];
        const missingEquipment = requiredEquipment.filter(req => 
          !roomEquipment.some((eq: any) => eq.type === req.type)
        );

        if (missingEquipment.length > 0) {
          violations.push({
            type: 'missing_equipment',
            message: `Salle ${room.name}: équipements manquants - ${missingEquipment.map((eq: any) => eq.type).join(', ')}`,
            sessionId: session.id,
            severity: 'medium'
          });
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      summary: `${violations.length} violation(s) de type d'examen détectée(s)`
    };
  } catch (error) {
    console.error('Erreur validation type examen:', error);
    return {
      isValid: false,
      violations: [],
      summary: 'Erreur lors de la validation des types d\'examen'
    };
  }
};

export const validateAcademicConstraints = async (examData: any): Promise<ValidationResult> => {
  try {
    const scheduleValidation = await validateExamSchedule(examData);
    const capacityValidation = await validateCapacityConstraints(examData);
    const typeValidation = await validateExamTypeConstraints(examData);

    const allViolations = [
      ...scheduleValidation.violations,
      ...capacityValidation.violations,
      ...typeValidation.violations
    ];

    return {
      isValid: allViolations.length === 0,
      violations: allViolations,
      summary: `${allViolations.length} violation(s) académique(s) détectée(s)`
    };
  } catch (error) {
    console.error('Erreur validation contraintes académiques:', error);
    return {
      isValid: false,
      violations: [],
      summary: 'Erreur lors de la validation des contraintes académiques'
    };
  }
};

export const checkRoomExamTypeCompatibility = (room: any, examType: string): boolean => {
  switch (examType) {
    case 'practical':
      return room.room_type === 'laboratory';
    case 'oral':
      return room.room_type === 'meeting_room';
    case 'computer':
      return room.room_type === 'computer_lab';
    default:
      return room.room_type === 'classroom' || room.room_type === 'amphitheater';
  }
};
