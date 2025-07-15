import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculationCache } from '@/services/CalculationCache';

export interface StudentAverages {
  student_id: string;
  academic_year_id: string;
  semester?: number;
  subject_averages: Record<string, number>;
  overall_average: number;
  total_credits: number;
  calculated_at: string;
}

export interface WeightedGradeCalculation {
  cc_grade: number;
  exam_grade: number;
  weighted_average: number; // ((CC × 0,4) + (EX × 0,6)) / 2
  coefficient: number;
  total: number; // weighted_average × coefficient
  subject_id: string;
  subject_name: string;
  nature: 'fondamentale' | 'complementaire';
}

export interface SemesterCalculation {
  semester: number;
  courses: WeightedGradeCalculation[];
  semester_average: number; // ∑(Total) / ∑(Coefficient)
  total_coefficients: number;
  total_points: number;
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

  // Calculate averages for a student with caching
  const calculateStudentAverages = useCallback(async (
    studentId: string,
    academicYearId: string,
    semester?: number
  ): Promise<StudentAverages | null> => {
    const cacheKey = 'student_averages';
    const params = { studentId, academicYearId, semester: semester || 'all' };

    // Check cache first
    const cached = calculationCache.get<StudentAverages>(cacheKey, params);
    if (cached) {
      return cached;
    }

    setLoading(true);
    setError(null);

    try {
      // Record calculation start
      const historyId = await supabase.rpc('record_calculation_start', {
        calculation_type: 'student_averages',
        calculation_params: params
      });

      const { data, error } = await supabase.rpc('calculate_student_averages', {
        p_student_id: studentId,
        p_academic_year_id: academicYearId,
        p_semester: semester || null
      });

      if (error) throw error;

      const result = data as unknown as StudentAverages;
      
      // Cache the result
      calculationCache.set(cacheKey, params, result, 5 * 60 * 1000); // 5 minutes TTL
      
      // Record calculation completion
      if (historyId.data) {
        await supabase.rpc('record_calculation_complete', {
          history_id: historyId.data,
          success: true,
          affected_count: 1
        });
      }

      return result;
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

  // Calculate averages for multiple students (class averages) with batch optimization
  const calculateClassAverages = useCallback(async (
    programId: string,
    academicYearId: string,
    semester?: number
  ): Promise<StudentAverages[]> => {
    setLoading(true);
    setError(null);

    try {
      // Record batch calculation start
      const historyId = await supabase.rpc('record_calculation_start', {
        calculation_type: 'class_averages',
        calculation_params: { programId, academicYearId, semester }
      });

      // Get all students from the program
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id')
        .eq('program_id', programId)
        .eq('status', 'active');

      if (studentsError) throw studentsError;

      const results: StudentAverages[] = [];
      const uncachedStudents: string[] = [];

      // Check cache for each student first
      for (const student of students) {
        const params = { studentId: student.id, academicYearId, semester: semester || 'all' };
        const cached = calculationCache.get<StudentAverages>('student_averages', params);
        
        if (cached) {
          results.push(cached);
        } else {
          uncachedStudents.push(student.id);
        }
      }

      // Calculate only uncached students
      if (uncachedStudents.length > 0) {
        const averagesPromises = uncachedStudents.map(studentId =>
          calculateStudentAverages(studentId, academicYearId, semester)
        );

        const newAverages = await Promise.all(averagesPromises);
        results.push(...newAverages.filter(avg => avg !== null) as StudentAverages[]);
      }

      // Record calculation completion
      if (historyId.data) {
        await supabase.rpc('record_calculation_complete', {
          history_id: historyId.data,
          success: true,
          affected_count: results.length
        });
      }

      toast({
        title: "Calcul terminé",
        description: `${results.length} moyennes calculées (${students.length - uncachedStudents.length} depuis le cache)`,
      });

      return results;
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

  // Calculate weighted average using the specific formula
  const calculateWeightedAverage = useCallback((ccGrade: number, examGrade: number): number => {
    return ((ccGrade * 0.4) + (examGrade * 0.6)) / 2;
  }, []);

  // Calculate semester totals for a student
  const calculateSemesterCalculations = useCallback(async (
    studentId: string,
    academicYearId: string,
    semester: number
  ): Promise<SemesterCalculation | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get all grades for the student in this semester
      const { data: grades, error: gradesError } = await supabase
        .from('student_grades')
        .select(`
          *,
          subjects!inner(id, name, credits_ects),
          evaluation_types!inner(name, code)
        `)
        .eq('student_id', studentId)
        .eq('academic_year_id', academicYearId)
        .eq('semester', semester)
        .eq('is_published', true);

      if (gradesError) throw gradesError;

      if (!grades || grades.length === 0) {
        return null;
      }

      // Group grades by subject and evaluation type
      const gradesBySubject = grades.reduce((acc, grade) => {
        const subjectId = grade.subject_id;
        if (!acc[subjectId]) {
          acc[subjectId] = {
            subject_id: subjectId,
            subject_name: grade.subjects.name,
            cc_grade: 0,
            exam_grade: 0,
            coefficient: grade.subjects.credits_ects || 1,
            nature: 'fondamentale' as const // Default, should come from subjects table
          };
        }

        // Assume CC and EX based on evaluation type code
        if (grade.evaluation_types.code.toLowerCase().includes('cc') || 
            grade.evaluation_types.code.toLowerCase().includes('continu')) {
          acc[subjectId].cc_grade = grade.grade;
        } else if (grade.evaluation_types.code.toLowerCase().includes('ex') || 
                   grade.evaluation_types.code.toLowerCase().includes('final')) {
          acc[subjectId].exam_grade = grade.grade;
        }

        return acc;
      }, {} as Record<string, any>);

      // Calculate weighted averages and totals
      const courses: WeightedGradeCalculation[] = Object.values(gradesBySubject).map((subject: any) => {
        const weighted_average = calculateWeightedAverage(subject.cc_grade, subject.exam_grade);
        const total = weighted_average * subject.coefficient;

        return {
          ...subject,
          weighted_average,
          total
        };
      });

      // Calculate semester average
      const total_points = courses.reduce((sum, course) => sum + course.total, 0);
      const total_coefficients = courses.reduce((sum, course) => sum + course.coefficient, 0);
      const semester_average = total_coefficients > 0 ? total_points / total_coefficients : 0;

      return {
        semester,
        courses,
        semester_average,
        total_coefficients,
        total_points
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du calcul du semestre';
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
  }, [calculateWeightedAverage, toast]);

  // Calculate general average across semesters
  const calculateGeneralAverage = useCallback((
    semester1: SemesterCalculation | null,
    semester2: SemesterCalculation | null
  ): number => {
    if (!semester1 && !semester2) return 0;
    if (!semester1) return semester2?.semester_average || 0;
    if (!semester2) return semester1.semester_average;

    const totalPoints = semester1.total_points + semester2.total_points;
    const totalCoefficients = semester1.total_coefficients + semester2.total_coefficients;

    return totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
  }, []);

  return {
    loading,
    error,
    calculateStudentAverages,
    generateStudentTranscript,
    calculateClassAverages,
    getClassStatistics,
    recalculateClassProgress,
    calculateWeightedAverage,
    calculateSemesterCalculations,
    calculateGeneralAverage
  };
}