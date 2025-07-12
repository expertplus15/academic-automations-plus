import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PerformanceMetric {
  id: string;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  academic_year_id?: string;
  program_id?: string;
  subject_id?: string;
  calculation_date: string;
  metadata?: Record<string, any>;
}

export interface PredictiveAnalytic {
  id: string;
  student_id: string;
  prediction_type: 'success_rate' | 'dropout_risk' | 'performance_trend' | 'recommendation';
  prediction_score: number;
  confidence_level: number;
  contributing_factors?: Record<string, any>;
  recommendations?: Record<string, any>;
  calculated_at: string;
  valid_until?: string;
}

export interface AnalyticsInsight {
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  impact_score: number;
  data: Record<string, any>;
  suggested_actions?: string[];
}

export function useAdvancedAnalytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [predictions, setPredictions] = useState<PredictiveAnalytic[]>([]);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);

  // Fetch performance metrics
  const fetchPerformanceMetrics = async (filters?: {
    academic_year_id?: string;
    program_id?: string;
    subject_id?: string;
    metric_type?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('academic_performance_metrics')
        .select(`
          *,
          programs(name, code),
          subjects(name, code),
          academic_years(name)
        `);

      if (filters?.academic_year_id) {
        query = query.eq('academic_year_id', filters.academic_year_id);
      }
      if (filters?.program_id) {
        query = query.eq('program_id', filters.program_id);
      }
      if (filters?.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters?.metric_type) {
        query = query.eq('metric_type', filters.metric_type);
      }
      if (filters?.date_from) {
        query = query.gte('calculation_date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('calculation_date', filters.date_to);
      }

      const { data, error } = await query.order('calculation_date', { ascending: false });
      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        id: item.id,
        metric_type: item.metric_type,
        metric_name: item.metric_name,
        metric_value: item.metric_value,
        academic_year_id: item.academic_year_id,
        program_id: item.program_id,
        subject_id: item.subject_id,
        calculation_date: item.calculation_date,
        metadata: typeof item.metadata === 'object' ? item.metadata as Record<string, any> : {}
      }));
      setMetrics(mappedData);
      return mappedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des métriques');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Calculate dropout risk for students
  const calculateDropoutRisk = async (student_ids: string[]) => {
    try {
      setLoading(true);
      const results = await Promise.allSettled(
        student_ids.map(async (student_id) => {
          const { data, error } = await supabase
            .rpc('calculate_dropout_risk_score', { p_student_id: student_id });
          
          if (error) throw error;
          return { student_id, risk_score: data };
        })
      );

      const validResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value);

      // Save predictions to database
      const predictions = validResults.map(result => ({
        student_id: result.student_id,
        prediction_type: 'dropout_risk' as const,
        prediction_score: result.risk_score,
        confidence_level: 0.85,
        contributing_factors: { calculation_method: 'simple_model' },
        calculated_at: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }));

      if (predictions.length > 0) {
        const { error } = await supabase
          .from('predictive_analytics')
          .insert(predictions);

        if (error) throw error;
      }

      return validResults;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du calcul du risque de décrochage');
    } finally {
      setLoading(false);
    }
  };

  // Fetch predictive analytics
  const fetchPredictiveAnalytics = async (filters?: {
    student_id?: string;
    prediction_type?: string;
    active_only?: boolean;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('predictive_analytics')
        .select(`
          *,
          students!inner(student_number, profiles!inner(full_name))
        `);

      if (filters?.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters?.prediction_type) {
        query = query.eq('prediction_type', filters.prediction_type);
      }
      if (filters?.active_only) {
        query = query.or('valid_until.is.null,valid_until.gte.' + new Date().toISOString());
      }

      const { data, error } = await query.order('calculated_at', { ascending: false });
      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        id: item.id,
        student_id: item.student_id,
        prediction_type: item.prediction_type as 'success_rate' | 'dropout_risk' | 'performance_trend' | 'recommendation',
        prediction_score: item.prediction_score,
        confidence_level: item.confidence_level,
        contributing_factors: typeof item.contributing_factors === 'object' ? item.contributing_factors as Record<string, any> : undefined,
        recommendations: typeof item.recommendations === 'object' ? item.recommendations as Record<string, any> : undefined,
        calculated_at: item.calculated_at,
        valid_until: item.valid_until
      }));
      setPredictions(mappedData);
      return mappedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des prédictions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Generate performance insights
  const generatePerformanceInsights = async (academic_year_id: string, program_id?: string) => {
    try {
      setLoading(true);
      
      // Fetch relevant data for insights
      const { data: grades, error: gradesError } = await supabase
        .from('student_grades')
        .select(`
          grade,
          subject_id,
          student_id,
          subjects(name, credits_ects),
          students(program_id)
        `)
        .eq('academic_year_id', academic_year_id)
        .eq('is_published', true);

      if (gradesError) throw gradesError;

      const { data: dropoutPredictions, error: predictionsError } = await supabase
        .from('predictive_analytics')
        .select('*')
        .eq('prediction_type', 'dropout_risk')
        .gte('prediction_score', 0.6);

      if (predictionsError) throw predictionsError;

      const insights: AnalyticsInsight[] = [];

      // Grade distribution analysis
      if (grades && grades.length > 0) {
        const averageGrade = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
        const lowGrades = grades.filter(g => g.grade < 10).length;
        const highGrades = grades.filter(g => g.grade >= 16).length;

        if (lowGrades > grades.length * 0.3) {
          insights.push({
            type: 'anomaly',
            severity: 'warning',
            title: 'Taux d\'échec élevé détecté',
            description: `${((lowGrades / grades.length) * 100).toFixed(1)}% des notes sont inférieures à 10/20`,
            impact_score: 0.8,
            data: { total_grades: grades.length, low_grades: lowGrades, percentage: (lowGrades / grades.length) * 100 },
            suggested_actions: [
              'Analyser les matières avec le plus d\'échecs',
              'Proposer du soutien pédagogique',
              'Revoir les méthodes d\'évaluation'
            ]
          });
        }

        if (averageGrade > 15) {
          insights.push({
            type: 'trend',
            severity: 'info',
            title: 'Excellentes performances académiques',
            description: `Moyenne générale de ${averageGrade.toFixed(2)}/20`,
            impact_score: 0.9,
            data: { average_grade: averageGrade, high_grades: highGrades },
            suggested_actions: [
              'Maintenir les bonnes pratiques pédagogiques',
              'Identifier les facteurs de réussite',
              'Partager les bonnes pratiques'
            ]
          });
        }
      }

      // High dropout risk analysis
      if (dropoutPredictions && dropoutPredictions.length > 0) {
        insights.push({
          type: 'prediction',
          severity: 'critical',
          title: 'Étudiants à risque de décrochage',
          description: `${dropoutPredictions.length} étudiants identifiés avec un risque élevé`,
          impact_score: 0.95,
          data: { at_risk_students: dropoutPredictions.length },
          suggested_actions: [
            'Contacter immédiatement les étudiants à risque',
            'Proposer un accompagnement personnalisé',
            'Analyser les causes du décrochage'
          ]
        });
      }

      setInsights(insights);
      return insights;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la génération des insights');
    } finally {
      setLoading(false);
    }
  };

  // Create performance metric
  const createPerformanceMetric = async (metric: Omit<PerformanceMetric, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('academic_performance_metrics')
        .insert([metric])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création de la métrique');
    }
  };

  // Generate comprehensive dashboard data
  const generateDashboardData = async (academic_year_id: string, program_id?: string) => {
    try {
      setLoading(true);

      // Fetch multiple data sources in parallel
      const [metricsData, predictionsData, insightsData] = await Promise.all([
        fetchPerformanceMetrics({ academic_year_id, program_id }),
        fetchPredictiveAnalytics({ active_only: true }),
        generatePerformanceInsights(academic_year_id, program_id)
      ]);

      // Calculate summary statistics
      const { data: gradesCount, error: countError } = await supabase
        .from('student_grades')
        .select('id', { count: 'exact' })
        .eq('academic_year_id', academic_year_id)
        .eq('is_published', true);

      if (countError) throw countError;

      const { data: studentsCount, error: studentsError } = await supabase
        .from('students')
        .select('id', { count: 'exact' })
        .eq('status', 'active');

      if (studentsError) throw studentsError;

      const dashboardData = {
        summary: {
          total_grades: gradesCount || 0,
          total_students: studentsCount || 0,
          active_predictions: predictionsData.length,
          critical_insights: insightsData.filter(i => i.severity === 'critical').length
        },
        metrics: metricsData,
        predictions: predictionsData,
        insights: insightsData,
        last_updated: new Date().toISOString()
      };

      return dashboardData;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la génération du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    metrics,
    predictions,
    insights,
    fetchPerformanceMetrics,
    calculateDropoutRisk,
    fetchPredictiveAnalytics,
    generatePerformanceInsights,
    createPerformanceMetric,
    generateDashboardData
  };
}