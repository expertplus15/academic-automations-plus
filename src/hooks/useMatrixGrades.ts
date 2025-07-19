
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MatrixStudent {
  id: string;
  student_number: string;
  full_name: string;
  email?: string;
  grades: {
    [evaluationType: string]: number | null;
  };
  average?: number;
  status: 'active' | 'inactive';
}

export interface EvaluationType {
  id: string;
  code: string;
  name: string;
  weight_percentage: number;
  max_grade?: number; // Optional - defaults to 20
}

export function useMatrixGrades() {
  const [students, setStudents] = useState<MatrixStudent[]>([]);
  const [evaluationTypes, setEvaluationTypes] = useState<EvaluationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load students and their grades for a specific subject
  const loadMatrixData = useCallback(async (subjectId: string, semester: number, academicYearId: string) => {
    setLoading(true);
    try {
      // Load evaluation types
      const { data: evalTypes, error: evalError } = await supabase
        .from('evaluation_types')
        .select('id, code, name, weight_percentage, description')
        .eq('is_active', true)
        .order('weight_percentage', { ascending: false });

      if (evalError) throw evalError;
      const typesWithMaxGrade = (evalTypes || []).map(type => ({
        ...type,
        max_grade: 20 // Default max grade
      }));
      setEvaluationTypes(typesWithMaxGrade);

      // Load students enrolled for this academic year
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('student_academic_enrollments')
        .select(`
          student:students(
            id,
            student_number,
            status,
            profiles!inner(
              full_name,
              email
            )
          )
        `)
        .eq('academic_year_id', academicYearId)
        .eq('enrollment_status', 'active');

      if (enrollmentsError) throw enrollmentsError;

      const studentsData = enrollmentsData?.map(enrollment => enrollment.student).filter(Boolean) || [];

      // Load existing grades for this subject/semester
      const { data: gradesData, error: gradesError } = await supabase
        .from('student_grades')
        .select(`
          student_id,
          evaluation_type_id,
          grade,
          evaluation_types!inner(code)
        `)
        .eq('subject_id', subjectId)
        .eq('semester', semester)
        .eq('academic_year_id', academicYearId);

      if (gradesError) throw gradesError;

      // Transform data for matrix display
      const matrixStudents: MatrixStudent[] = (studentsData || []).map(student => {
        const studentGrades: { [key: string]: number | null } = {};
        let totalGrades = 0;
        let gradeCount = 0;

        // Initialize all evaluation types with null
        evalTypes?.forEach(evalType => {
          studentGrades[evalType.code] = null;
        });

        // Fill in existing grades
        gradesData?.forEach(grade => {
          if (grade.student_id === student.id && grade.evaluation_types) {
            studentGrades[grade.evaluation_types.code] = grade.grade;
            totalGrades += grade.grade;
            gradeCount++;
          }
        });

        const average = gradeCount > 0 ? totalGrades / gradeCount : undefined;

        return {
          id: student.id,
          student_number: student.student_number,
          full_name: student.profiles.full_name,
          email: student.profiles.email,
          grades: studentGrades,
          average: average ? Number(average.toFixed(2)) : undefined,
          status: student.status as 'active' | 'inactive'
        };
      });

      setStudents(matrixStudents);
      
      toast({
        title: "Données chargées",
        description: `${matrixStudents.length} étudiants chargés`,
      });

    } catch (error) {
      console.error('Error loading matrix data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update a single grade
  const updateGrade = useCallback((studentId: string, evaluationTypeCode: string, grade: number | null) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedGrades = { ...student.grades, [evaluationTypeCode]: grade };
        
        // Recalculate average
        const validGrades = Object.values(updatedGrades).filter(g => g !== null) as number[];
        const average = validGrades.length > 0 
          ? Number((validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length).toFixed(2))
          : undefined;

        return {
          ...student,
          grades: updatedGrades,
          average
        };
      }
      return student;
    }));
  }, []);

  // Save all grades to database
  const saveGrades = useCallback(async (subjectId: string, semester: number, academicYearId: string) => {
    setSaving(true);
    try {
      const gradesToSave = [];

      for (const student of students) {
        for (const [evalCode, grade] of Object.entries(student.grades)) {
          if (grade !== null) {
            const evalType = evaluationTypes.find(et => et.code === evalCode);
            if (evalType) {
              gradesToSave.push({
                student_id: student.id,
                subject_id: subjectId,
                evaluation_type_id: evalType.id,
                grade: grade,
                max_grade: evalType.max_grade || 20,
                semester: semester,
                academic_year_id: academicYearId,
                is_published: false,
                evaluation_date: new Date().toISOString().split('T')[0]
              });
            }
          }
        }
      }

      if (gradesToSave.length > 0) {
        // Delete existing grades first
        await supabase
          .from('student_grades')
          .delete()
          .eq('subject_id', subjectId)
          .eq('semester', semester)
          .eq('academic_year_id', academicYearId);

        // Insert new grades
        const { error } = await supabase
          .from('student_grades')
          .insert(gradesToSave);

        if (error) throw error;

        toast({
          title: "Sauvegarde réussie",
          description: `${gradesToSave.length} notes sauvegardées`,
        });
      }

    } catch (error) {
      console.error('Error saving grades:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [students, evaluationTypes, toast]);

  // Validate grades before saving
  const validateGrades = useCallback(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    students.forEach(student => {
      Object.entries(student.grades).forEach(([evalCode, grade]) => {
        if (grade !== null) {
          const evalType = evaluationTypes.find(et => et.code === evalCode);
          const maxGrade = evalType?.max_grade || 20;
          if (evalType && (grade < 0 || grade > maxGrade)) {
            errors.push(`${student.full_name}: Note ${evalCode} invalide (${grade}/${maxGrade})`);
          }
          if (evalType && grade < maxGrade * 0.3) {
            warnings.push(`${student.full_name}: Note ${evalCode} très basse (${grade}/${maxGrade})`);
          }
        }
      });
    });

    return { errors, warnings };
  }, [students, evaluationTypes]);

  return {
    students,
    evaluationTypes,
    loading,
    saving,
    loadMatrixData,
    updateGrade,
    saveGrades,
    validateGrades
  };
}
