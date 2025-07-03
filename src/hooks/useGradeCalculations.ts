import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentAverages {
  student_id: string;
  academic_year_id: string;
  semester?: number;
  subject_averages: Record<string, number>;
  overall_average: number;
  total_credits: number;
  calculated_at: string;
}

export interface StudentTranscript {
  student_info: {
    id: string;
    student_number: string;
    full_name: string;
    email: string;
    program_name: string;
    level_name: string;
    enrollment_date: string;
  };
  academic_year_id: string;
  grades_by_semester: Record<string, StudentAverages>;
  overall_statistics: StudentAverages;
  generated_at: string;
}

export function useGradeCalculations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate averages for a student
  const calculateStudentAverages = useCallback(async (
    studentId: string,
    academicYearId: string,
    semester?: number
  ): Promise<StudentAverages | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('calculate_student_averages', {
        p_student_id: studentId,
        p_academic_year_id: academicYearId,
        p_semester: semester || null
      });

      if (error) throw error;
      return data as unknown as StudentAverages;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du calcul des moyennes';
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
  }, [toast]);

  // Generate student transcript
  const generateStudentTranscript = useCallback(async (
    studentId: string,
    academicYearId: string
  ): Promise<StudentTranscript | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('generate_student_transcript', {
        p_student_id: studentId,
        p_academic_year_id: academicYearId
      });

      if (error) throw error;
      return data as unknown as StudentTranscript;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la génération du relevé';
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
  }, [toast]);

  // Calculate averages for multiple students (class averages)
  const calculateClassAverages = useCallback(async (
    programId: string,
    academicYearId: string,
    semester?: number
  ): Promise<StudentAverages[]> => {
    setLoading(true);
    setError(null);

    try {
      // Get all students from the program
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id')
        .eq('program_id', programId)
        .eq('status', 'active');

      if (studentsError) throw studentsError;

      // Calculate averages for each student
      const averagesPromises = students.map(student =>
        calculateStudentAverages(student.id, academicYearId, semester)
      );

      const averages = await Promise.all(averagesPromises);
      return averages.filter(avg => avg !== null) as StudentAverages[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du calcul des moyennes de classe';
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
  }, [calculateStudentAverages, toast]);

  // Get class statistics (min, max, average)
  const getClassStatistics = useCallback(async (
    subjectId: string,
    academicYearId: string,
    semester: number
  ): Promise<{
    min: number;
    max: number;
    average: number;
    median: number;
    studentCount: number;
  } | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('student_grades')
        .select('grade')
        .eq('subject_id', subjectId)
        .eq('academic_year_id', academicYearId)
        .eq('semester', semester)
        .eq('is_published', true);

      if (error) throw error;

      if (!data || data.length === 0) {
        return null;
      }

      const grades = data.map(g => g.grade).sort((a, b) => a - b);
      const sum = grades.reduce((acc, grade) => acc + grade, 0);
      const average = sum / grades.length;
      const median = grades.length % 2 === 0
        ? (grades[grades.length / 2 - 1] + grades[grades.length / 2]) / 2
        : grades[Math.floor(grades.length / 2)];

      return {
        min: Math.min(...grades),
        max: Math.max(...grades),
        average: Number(average.toFixed(2)),
        median: Number(median.toFixed(2)),
        studentCount: grades.length
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du calcul des statistiques';
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
  }, [toast]);

  // Recalculate all student progress for a class
  const recalculateClassProgress = useCallback(async (
    programId: string,
    academicYearId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Get all students from the program
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id')
        .eq('program_id', programId)
        .eq('status', 'active');

      if (studentsError) throw studentsError;

      // Trigger recalculation for each student
      for (const student of students) {
        await calculateStudentAverages(student.id, academicYearId);
      }

      toast({
        title: "Succès",
        description: `Recalcul terminé pour ${students.length} étudiants`,
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du recalcul';
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
  }, [calculateStudentAverages, toast]);

  return {
    loading,
    error,
    calculateStudentAverages,
    generateStudentTranscript,
    calculateClassAverages,
    getClassStatistics,
    recalculateClassProgress
  };
}