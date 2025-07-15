import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SemesterSubjectGrade {
  subject_id: string;
  subject_name: string;
  cc: number | null;
  ef: number | null;
  moyenne: number | null;
  coefficient: number;
}

export interface SemesterStudentData {
  id: string;
  student_number: string;
  full_name: string;
  subjects: Record<string, SemesterSubjectGrade>;
  semester_average: number | null;
  mention: string;
}

export function useSemesterGrades() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getSemesterGrades = useCallback(async (
    programId: string, 
    groupId: string, 
    semester: number,
    academicYearId: string
  ) => {
    if (!programId || !semester || !academicYearId) return [];

    setLoading(true);
    try {
      // Get all subjects for this program and semester
      const { data: programSubjects, error: subjectsError } = await supabase
        .from('program_subjects')
        .select(`
          subject_id,
          subjects!inner(
            id,
            name,
            credits_ects
          )
        `)
        .eq('program_id', programId)
        .eq('semester', semester);

      if (subjectsError) throw subjectsError;

      // Get evaluation types for CC and EF
      const { data: evalTypes, error: evalError } = await supabase
        .from('evaluation_types')
        .select('id, code')
        .eq('is_active', true);

      if (evalError) throw evalError;

      const ccEvalType = evalTypes?.find(et => et.code === 'CC');
      const efEvalType = evalTypes?.find(et => et.code === 'EF');

      // Get all students from the group/program
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          profiles!inner(full_name)
        `)
        .eq('program_id', programId)
        .eq('status', 'active')
        .order('student_number');

      if (studentsError) throw studentsError;

      // Get all grades for these students, subjects, and semester
      const studentIds = students?.map(s => s.id) || [];
      const subjectIds = programSubjects?.map(ps => ps.subject_id) || [];

      const { data: grades, error: gradesError } = await supabase
        .from('student_grades')
        .select('*')
        .in('student_id', studentIds)
        .in('subject_id', subjectIds)
        .eq('semester', semester)
        .eq('academic_year_id', academicYearId);

      if (gradesError) throw gradesError;

      // Transform data into semester matrix format
      const semesterData: SemesterStudentData[] = students?.map(student => {
        const studentSubjects: Record<string, SemesterSubjectGrade> = {};

        // Initialize all subjects for this student
        programSubjects?.forEach(ps => {
          const subject = ps.subjects;
          studentSubjects[subject.id] = {
            subject_id: subject.id,
            subject_name: subject.name,
            cc: null,
            ef: null,
            moyenne: null,
            coefficient: subject.credits_ects || 1
          };
        });

        // Fill in actual grades
        grades?.forEach(grade => {
          if (grade.student_id === student.id && studentSubjects[grade.subject_id]) {
            if (grade.evaluation_type_id === ccEvalType?.id) {
              studentSubjects[grade.subject_id].cc = grade.grade;
            } else if (grade.evaluation_type_id === efEvalType?.id) {
              studentSubjects[grade.subject_id].ef = grade.grade;
            }
          }
        });

        // Calculate subject averages and semester average
        let totalWeightedSum = 0;
        let totalCoefficients = 0;
        let hasGrades = false;

        Object.values(studentSubjects).forEach(subject => {
          const { cc, ef, coefficient } = subject;
          
          if (cc !== null || ef !== null) {
            hasGrades = true;
            // Calculate subject average (CC: 40%, EF: 60%)
            let subjectAvg = null;
            if (cc !== null && ef !== null) {
              subjectAvg = (cc * 0.4) + (ef * 0.6);
            } else if (ef !== null) {
              subjectAvg = ef; // If only final exam
            } else if (cc !== null) {
              subjectAvg = cc; // If only continuous assessment
            }
            
            if (subjectAvg !== null) {
              subject.moyenne = Math.round(subjectAvg * 100) / 100;
              totalWeightedSum += subjectAvg * coefficient;
              totalCoefficients += coefficient;
            }
          }
        });

        const semesterAverage = totalCoefficients > 0 ? 
          Math.round((totalWeightedSum / totalCoefficients) * 100) / 100 : null;

        // Determine mention
        let mention = '';
        if (semesterAverage !== null) {
          if (semesterAverage >= 16) mention = 'Très Bien';
          else if (semesterAverage >= 14) mention = 'Bien';
          else if (semesterAverage >= 12) mention = 'Assez Bien';
          else if (semesterAverage >= 10) mention = 'Passable';
          else mention = 'Insuffisant';
        }

        return {
          id: student.id,
          student_number: student.student_number,
          full_name: student.profiles.full_name,
          subjects: studentSubjects,
          semester_average: semesterAverage,
          mention
        };
      }) || [];

      return semesterData;
    } catch (error) {
      console.error('Error fetching semester grades:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du semestre",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    getSemesterGrades
  };
}