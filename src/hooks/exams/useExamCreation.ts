import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ExamCreationData {
  // Basic Info
  title?: string;
  description?: string;
  examType?: string;
  subjectId?: string;
  programId?: string;
  semester?: number;
  
  // Configuration
  durationMinutes?: number;
  minStudents?: number;
  maxStudents?: number;
  registeredStudents?: number;
  minSupervisors?: number;
  coefficient?: number;
  materials?: string[];
  instructions?: string;
  allowMakeup?: boolean;
  allowDigitalDocuments?: boolean;
  anonymousGrading?: boolean;
  
  // Scheduling
  scheduledDate?: string;
  scheduledTime?: string;
  roomId?: string;
  roomName?: string;
  selectedSupervisors?: string[];
}

export function useExamCreation() {
  const [examData, setExamData] = useState<ExamCreationData>({
    durationMinutes: 120,
    minSupervisors: 2,
    coefficient: 1.0,
    materials: [],
    allowMakeup: false,
    allowDigitalDocuments: false,
    anonymousGrading: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateExamData = useCallback((updates: Partial<ExamCreationData>) => {
    setExamData(prev => ({ ...prev, ...updates }));
    // Clear related errors when data is updated
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        if (newErrors[field]) {
          delete newErrors[field];
        }
      });
      return newErrors;
    });
  }, []);

  const validateStep = useCallback(async (step: number, data: ExamCreationData): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Info
        if (!data.title?.trim()) {
          newErrors.title = 'Le titre est requis';
        }
        if (!data.examType) {
          newErrors.examType = 'Le type d\'examen est requis';
        }
        if (!data.subjectId) {
          newErrors.subjectId = 'La matière est requise';
        }
        if (!data.programId) {
          newErrors.programId = 'Le programme est requis';
        }
        break;

      case 2: // Configuration
        if (!data.durationMinutes || data.durationMinutes < 30) {
          newErrors.durationMinutes = 'La durée doit être d\'au moins 30 minutes';
        }
        if (data.durationMinutes && data.durationMinutes > 300) {
          newErrors.durationMinutes = 'La durée ne peut pas dépasser 5 heures';
        }
        if (!data.maxStudents || data.maxStudents < 1) {
          newErrors.maxStudents = 'Le nombre maximum d\'étudiants est requis';
        }
        if (!data.minSupervisors || data.minSupervisors < 1) {
          newErrors.minSupervisors = 'Au moins un surveillant est requis';
        }
        if (!data.coefficient || data.coefficient < 0.5 || data.coefficient > 5) {
          newErrors.coefficient = 'Le coefficient doit être entre 0.5 et 5';
        }
        break;

      case 3: // Scheduling
        if (!data.scheduledDate) {
          newErrors.scheduledDate = 'La date est requise';
        }
        if (!data.scheduledTime) {
          newErrors.scheduledTime = 'L\'horaire est requis';
        }
        if (!data.roomId) {
          newErrors.roomId = 'La salle est requise';
        }
        if (!data.selectedSupervisors || data.selectedSupervisors.length < (data.minSupervisors || 1)) {
          newErrors.selectedSupervisors = `Au moins ${data.minSupervisors || 1} surveillant(s) requis`;
        }
        break;

      case 4: // Review
        // Final validation - all previous steps must be valid
        const step1Valid = await validateStep(1, data);
        const step2Valid = await validateStep(2, data);
        const step3Valid = await validateStep(3, data);
        
        if (!step1Valid || !step2Valid || !step3Valid) {
          newErrors.general = 'Veuillez compléter toutes les étapes précédentes';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const createExam = useCallback(async (data: ExamCreationData) => {
    setIsLoading(true);
    try {
      // Create the exam in the database
      const { data: examResult, error: examError } = await supabase
        .from('exams')
        .insert([{
          title: data.title,
          description: data.description,
          exam_type: data.examType,
          subject_id: data.subjectId,
          program_id: data.programId,
          duration_minutes: data.durationMinutes,
          max_students: data.maxStudents,
          min_supervisors: data.minSupervisors,
          status: 'scheduled',
          materials_required: data.materials || [],
          instructions: {
            general: data.instructions,
            materials: data.materials,
            allowMakeup: data.allowMakeup,
            allowDigitalDocuments: data.allowDigitalDocuments,
            anonymousGrading: data.anonymousGrading
          }
        }])
        .select()
        .single();

      if (examError) {
        throw examError;
      }

      // Create exam session
      if (data.scheduledDate && data.scheduledTime && data.roomId) {
        const startDateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
        const endDateTime = new Date(startDateTime.getTime() + (data.durationMinutes || 120) * 60000);

        const { error: sessionError } = await supabase
          .from('exam_sessions')
          .insert([{
            exam_id: examResult.id,
            room_id: data.roomId,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            status: 'scheduled'
          }]);

        if (sessionError) {
          throw sessionError;
        }
      }

      // Assign supervisors if selected
      if (data.selectedSupervisors && data.selectedSupervisors.length > 0) {
        const supervisorInserts = data.selectedSupervisors.map(supervisorId => ({
          session_id: examResult.id, // Using exam ID as session reference
          teacher_id: supervisorId,
          status: 'assigned'
        }));

        const { error: supervisorError } = await supabase
          .from('exam_supervisors')
          .insert(supervisorInserts);

        if (supervisorError) {
          console.warn('Error assigning supervisors:', supervisorError);
          // Don't throw - this is not critical
        }
      }

      return examResult;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveDraft = useCallback(async (data: ExamCreationData) => {
    setIsLoading(true);
    try {
      // Save as draft - could be implemented to save to localStorage or database
      localStorage.setItem('examDraft', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem('examDraft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setExamData(parsedDraft);
        return parsedDraft;
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    return null;
  }, []);

  return {
    examData,
    updateExamData,
    validateStep,
    createExam,
    saveDraft,
    loadDraft,
    isLoading,
    errors
  };
}