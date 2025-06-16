
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AcademicMetrics {
  averageGrade: number;
  attendanceRate: number;
  studentsAtRisk: number;
  recentEvaluations: number;
  gradeTrend: number;
  attendanceTrend: number;
  riskTrend: number;
  evaluationTrend: number;
}

export function useAcademicMetrics() {
  const [metrics, setMetrics] = useState<AcademicMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer la moyenne générale
      const { data: gradesData } = await supabase
        .from('student_grades')
        .select('grade, max_grade')
        .eq('is_published', true);

      // Récupérer les données de présence
      const { data: attendanceData } = await supabase
        .from('attendance_records')
        .select('status');

      // Récupérer les alertes actives
      const { data: alertsData } = await supabase
        .from('academic_alerts')
        .select('id')
        .eq('is_active', true);

      // Récupérer les évaluations récentes (cette semaine)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data: recentEvaluationsData } = await supabase
        .from('student_grades')
        .select('id')
        .gte('evaluation_date', oneWeekAgo.toISOString().split('T')[0]);

      // Calculer les métriques
      const averageGrade = gradesData?.length ? 
        gradesData.reduce((sum, grade) => sum + (grade.grade / grade.max_grade * 20), 0) / gradesData.length : 0;

      const attendanceRate = attendanceData?.length ?
        (attendanceData.filter(record => record.status === 'present').length / attendanceData.length) * 100 : 0;

      const studentsAtRisk = alertsData?.length || 0;
      const recentEvaluations = recentEvaluationsData?.length || 0;

      setMetrics({
        averageGrade,
        attendanceRate,
        studentsAtRisk,
        recentEvaluations,
        gradeTrend: Math.random() * 10 - 5, // Mock trends for now
        attendanceTrend: Math.random() * 10 - 5,
        riskTrend: Math.random() * 10 - 5,
        evaluationTrend: Math.random() * 10 - 5,
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des métriques:', err);
      setError('Erreur lors du chargement des métriques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, loading, error, refetch: fetchMetrics };
}
