import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStudentGrades } from '@/hooks/useStudentGrades';
import { useEvaluationTypes } from '@/hooks/useEvaluationTypes';

export interface EvaluationDashboardStats {
  totalGrades: number;
  gradesThisWeek: number;
  totalEvaluationTypes: number;
  activeMatrixSessions: number;
  averagesCalculated: number;
  pendingValidation: number;
  averageGradeValue: number;
  studentsWithGrades: number;
}

export function useEvaluationsData() {
  const [stats, setStats] = useState<EvaluationDashboardStats>({
    totalGrades: 0,
    gradesThisWeek: 0,
    totalEvaluationTypes: 0,
    activeMatrixSessions: 0,
    averagesCalculated: 0,
    pendingValidation: 0,
    averageGradeValue: 0,
    studentsWithGrades: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [evaluationTypes, setEvaluationTypes] = useState<any[]>([]);

  const { getMatriceGrades } = useStudentGrades();
  const { fetchEvaluationTypes } = useEvaluationTypes();

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all grades with evaluation types and students
      const { data: gradesData, error: gradesError } = await supabase
        .from('student_grades')
        .select(`
          *,
          evaluation_types(name, code, weight_percentage),
          students(student_number, profiles(full_name))
        `)
        .order('created_at', { ascending: false });

      if (gradesError) throw gradesError;

      // Fetch evaluation types
      const { data: evalTypesData, error: evalTypesError } = await supabase
        .from('evaluation_types')
        .select('*')
        .eq('is_active', true);

      if (evalTypesError) throw evalTypesError;

      // Calculate statistics
      const totalGrades = gradesData?.length || 0;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const gradesThisWeek = gradesData?.filter(grade => 
        new Date(grade.created_at) >= oneWeekAgo
      ).length || 0;

      const pendingValidation = gradesData?.filter(grade => 
        !grade.is_published
      ).length || 0;

      const publishedGrades = gradesData?.filter(grade => 
        grade.is_published && grade.grade !== null
      ) || [];

      const averageGradeValue = publishedGrades.length > 0
        ? publishedGrades.reduce((sum, grade) => sum + (grade.grade || 0), 0) / publishedGrades.length
        : 0;

      const uniqueStudents = new Set(gradesData?.map(grade => grade.student_id) || []).size;

      // Get recent grades for display
      const recentGradesFormatted = gradesData?.slice(0, 10).map(grade => ({
        id: grade.id,
        student_name: grade.students?.profiles?.full_name || 'N/A',
        student_number: grade.students?.student_number || 'N/A',
        evaluation_type: grade.evaluation_types?.name || 'N/A',
        grade: grade.grade,
        max_grade: grade.max_grade,
        created_at: grade.created_at,
        is_published: grade.is_published
      })) || [];

      setStats({
        totalGrades,
        gradesThisWeek,
        totalEvaluationTypes: evalTypesData?.length || 0,
        activeMatrixSessions: Math.floor(Math.random() * 8) + 2, // Simulated for now
        averagesCalculated: publishedGrades.length,
        pendingValidation,
        averageGradeValue,
        studentsWithGrades: uniqueStudents
      });

      setRecentGrades(recentGradesFormatted);
      setEvaluationTypes(evalTypesData || []);

    } catch (err) {
      console.error('Error fetching evaluation stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const refreshStats = useCallback(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    recentGrades,
    evaluationTypes
  };
}