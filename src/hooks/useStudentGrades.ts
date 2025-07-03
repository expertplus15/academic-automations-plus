import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentGrade {
  id: string;
  student_id: string;
  subject_id: string;
  evaluation_type_id: string;
  grade: number;
  max_grade: number;
  evaluation_date: string;
  semester: number;
  academic_year_id: string;
  teacher_id?: string;
  is_published: boolean;
  comments?: string;
  created_at: string;
  updated_at: string;
}

export interface GradeEntry {
  student_id: string;
  subject_id: string;
  evaluation_type_id: string;
  grade: number;
  max_grade?: number;
  evaluation_date: string;
  semester: number;
  academic_year_id: string;
  teacher_id?: string;
  comments?: string;
}

export interface GradeValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  validated_at: string;
}

export function useStudentGrades() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get grades for a specific student
  const getStudentGrades = useCallback(async (
    studentId: string,
    academicYearId?: string,
    semester?: number
  ): Promise<StudentGrade[]> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('student_grades')
        .select(`
          *,
          students!inner(student_number, profiles!inner(full_name)),
          subjects!inner(name, code),
          evaluation_types!inner(name, code, weight_percentage)
        `)
        .eq('student_id', studentId);

      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      if (semester !== undefined) {
        query = query.eq('semester', semester);
      }

      const { data, error } = await query.order('evaluation_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des notes';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get grades for multiple students (for matricial view)
  const getMatriceGrades = useCallback(async (
    subjectId: string,
    academicYearId: string,
    semester: number,
    programId?: string
  ): Promise<any[]> => {
    setLoading(true);
    setError(null);

    try {
      // First get all students for the program
      let studentsQuery = supabase
        .from('students')
        .select(`
          id, student_number, profile_id,
          profiles!inner(full_name)
        `)
        .eq('status', 'active');

      if (programId) {
        studentsQuery = studentsQuery.eq('program_id', programId);
      }

      const { data: students, error: studentsError } = await studentsQuery
        .order('student_number');

      if (studentsError) throw studentsError;

      // Then get grades for these students
      const studentIds = students?.map(s => s.id) || [];
      
      if (studentIds.length === 0) {
        return [];
      }

      const { data: grades, error: gradesError } = await supabase
        .from('student_grades')
        .select(`
          *,
          evaluation_types!inner(name, code, weight_percentage)
        `)
        .eq('subject_id', subjectId)
        .eq('academic_year_id', academicYearId)
        .eq('semester', semester)
        .in('student_id', studentIds);

      if (gradesError) throw gradesError;

      // Combine students and grades data
      const result = students?.map(student => ({
        student,
        grades: grades?.filter(g => g.student_id === student.id) || []
      })) || [];

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération de la matrice';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Validate grade entry
  const validateGrade = useCallback(async (
    studentId: string,
    subjectId: string,
    evaluationTypeId: string,
    grade: number,
    maxGrade: number = 20
  ): Promise<GradeValidation | null> => {
    try {
      const { data, error } = await supabase.rpc('validate_grade_entry', {
        p_student_id: studentId,
        p_subject_id: subjectId,
        p_evaluation_type_id: evaluationTypeId,
        p_grade: grade,
        p_max_grade: maxGrade
      });

      if (error) throw error;
      return data as unknown as GradeValidation;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de validation';
      setError(message);
      return null;
    }
  }, []);

  // Create or update a grade
  const saveGrade = useCallback(async (gradeData: GradeEntry): Promise<StudentGrade | null> => {
    setLoading(true);
    setError(null);

    try {
      // Validate first
      const validation = await validateGrade(
        gradeData.student_id,
        gradeData.subject_id,
        gradeData.evaluation_type_id,
        gradeData.grade,
        gradeData.max_grade
      );

      if (!validation?.valid) {
        const errors = validation?.errors || ['Erreur de validation'];
        throw new Error(errors.join(', '));
      }

      // Show warnings if any
      if (validation.warnings && validation.warnings.length > 0) {
        toast({
          title: "Attention",
          description: validation.warnings.join(', '),
          variant: "default",
        });
      }

      const { data, error } = await supabase
        .from('student_grades')
        .upsert({
          ...gradeData,
          is_published: false // Default to unpublished
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Note enregistrée avec succès",
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [validateGrade, toast]);

  // Bulk save grades (for matricial interface)
  const saveGradesBatch = useCallback(async (grades: GradeEntry[]): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('student_grades')
        .upsert(grades.map(grade => ({
          ...grade,
          is_published: false
        })))
        .select();

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${grades.length} notes sauvegardées`,
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde en lot';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Publish grades
  const publishGrades = useCallback(async (gradeIds: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('student_grades')
        .update({ is_published: true })
        .in('id', gradeIds);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${gradeIds.length} notes publiées`,
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la publication';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete a grade
  const deleteGrade = useCallback(async (gradeId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('student_grades')
        .delete()
        .eq('id', gradeId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Note supprimée",
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    getStudentGrades,
    getMatriceGrades,
    validateGrade,
    saveGrade,
    saveGradesBatch,
    publishGrades,
    deleteGrade
  };
}