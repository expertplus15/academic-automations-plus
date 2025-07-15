import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentGrade {
  id?: string;
  student_id: string;
  subject_id: string;
  evaluation_type_id: string;
  grade: number;
  max_grade?: number;
  semester: number;
  academic_year_id: string;
  evaluation_date: string;
  is_published?: boolean;
  teacher_id?: string;
  comments?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentWithGrades {
  id: string;
  student_number: string;
  profiles: {
    full_name: string;
  };
  grades: {
    cc?: number;
    examen?: number;
    moyenne?: number;
    coefficient?: number;
    mention?: string;
  };
}

export function useStudentGrades() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getMatriceGrades = useCallback(async (subjectId: string, semester: number) => {
    setLoading(true);
    try {
      // Get evaluation types first to map codes
      const { data: evalTypes, error: evalError } = await supabase
        .from('evaluation_types')
        .select('id, code')
        .eq('is_active', true);

      if (evalError) throw evalError;

      const { data, error } = await supabase
        .from('student_grades')
        .select(`
          *,
          students!inner(
            id,
            student_number,
            profiles!inner(full_name)
          )
        `)
        .eq('subject_id', subjectId)
        .eq('semester', semester);

      if (error) throw error;

      // Transform data for matrix display
      const matrixData: StudentWithGrades[] = [];
      const studentMap = new Map();
      
      // Create evaluation type lookup map
      const evalTypeMap = new Map(evalTypes?.map(et => [et.id, et.code]) || []);

      data?.forEach((grade) => {
        const studentId = grade.students.id;
        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            id: studentId,
            student_number: grade.students.student_number,
            profiles: { full_name: grade.students.profiles.full_name },
            grades: { coefficient: 2 } // Default coefficient
          });
        }

        const student = studentMap.get(studentId);
        const evalCode = evalTypeMap.get(grade.evaluation_type_id);
        
        if (evalCode === 'CC') {
          student.grades.cc = grade.grade;
        } else if (evalCode === 'EF') {
          student.grades.examen = grade.grade;
        }
      });

      return Array.from(studentMap.values());
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notes",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveGradesBatch = useCallback(async (grades: StudentGrade[]) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('student_grades')
        .upsert(grades, { onConflict: 'student_id,subject_id,evaluation_type_id,semester' });

      if (error) throw error;

      toast({
        title: "Notes sauvegardées",
        description: `${grades.length} notes ont été enregistrées`,
      });

      return true;
    } catch (error) {
      console.error('Error saving grades:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const calculateStudentAverages = useCallback(async (studentId: string, academicYearId: string, semester?: number) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_student_averages', {
          p_student_id: studentId,
          p_academic_year_id: academicYearId,
          p_semester: semester
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error calculating averages:', error);
      return null;
    }
  }, []);

  const validateGrade = useCallback(async (
    studentId: string,
    subjectId: string,
    evaluationTypeId: string,
    grade: number,
    maxGrade: number = 20
  ) => {
    try {
      const { data, error } = await supabase
        .rpc('validate_grade_entry', {
          p_student_id: studentId,
          p_subject_id: subjectId,
          p_evaluation_type_id: evaluationTypeId,
          p_grade: grade,
          p_max_grade: maxGrade
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error validating grade:', error);
      return { valid: false, errors: ['Erreur de validation'], warnings: [] };
    }
  }, []);

  return {
    loading,
    getMatriceGrades,
    saveGradesBatch,
    calculateStudentAverages,
    validateGrade
  };
}