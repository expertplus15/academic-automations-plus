import { supabase } from "@/integrations/supabase/client";

export interface Anomaly {
  id: string;
  type: 'grade_outlier' | 'attendance_drop' | 'performance_decline' | 'grade_pattern' | 'data_inconsistency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  studentId?: string;
  subjectId?: string;
  data: any;
  confidence: number;
  suggestions: string[];
  timestamp: number;
  resolved: boolean;
}

export interface IntelligentSuggestion {
  id: string;
  type: 'grade_adjustment' | 'evaluation_strategy' | 'student_support' | 'curriculum_change';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  data: any;
  actions: Array<{
    label: string;
    action: string;
    parameters: any;
  }>;
  timestamp: number;
}

export interface OptimizationResult {
  id: string;
  type: 'grade_distribution' | 'evaluation_timing' | 'difficulty_balance' | 'resource_allocation';
  currentState: any;
  optimizedState: any;
  expectedImprovement: number;
  implementationSteps: string[];
  metrics: {
    before: any;
    after: any;
    improvement: number;
  };
}

export class AIAnalyticsService {
  
  // Detect anomalies in grades data
  static async detectAnomalies(filters?: {
    subjectId?: string;
    programId?: string;
    dateRange?: { start: string; end: string };
  }): Promise<Anomaly[]> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'detect_anomalies',
        filters
      }
    });

    if (error) throw error;
    return data?.anomalies || [];
  }

  // Get intelligent suggestions
  static async getIntelligentSuggestions(context: {
    subjectId?: string;
    studentId?: string;
    gradeData?: any[];
  }): Promise<IntelligentSuggestion[]> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'get_suggestions',
        context
      }
    });

    if (error) throw error;
    return data?.suggestions || [];
  }

  // Optimize grade distribution
  static async optimizeGradeDistribution(subjectId: string, currentGrades: any[]): Promise<OptimizationResult> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'optimize_grades',
        subjectId,
        currentGrades
      }
    });

    if (error) throw error;
    return data;
  }

  // Analyze grade patterns
  static async analyzeGradePatterns(data: {
    grades: any[];
    timeframe: string;
    groupBy?: 'student' | 'subject' | 'evaluation_type';
  }): Promise<{
    trends: Array<{ label: string; value: number; change: number }>;
    patterns: Array<{ type: string; description: string; confidence: number }>;
    predictions: Array<{ metric: string; predicted_value: number; confidence: number }>;
  }> {
    const { data: result, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'analyze_patterns',
        ...data
      }
    });

    if (error) throw error;
    return result;
  }

  // Auto-adjust grades based on curve
  static async autoAdjustGrades(params: {
    subjectId: string;
    evaluationId: string;
    adjustmentType: 'curve' | 'scale' | 'normalize';
    targetAverage?: number;
    targetDistribution?: 'normal' | 'uniform';
  }): Promise<{
    originalGrades: any[];
    adjustedGrades: any[];
    adjustmentFactor: number;
    preview: boolean;
  }> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'auto_adjust_grades',
        ...params
      }
    });

    if (error) throw error;
    return data;
  }

  // Predict student performance
  static async predictStudentPerformance(studentId: string): Promise<{
    predictions: Array<{
      subject: string;
      predicted_grade: number;
      confidence: number;
      factors: string[];
    }>;
    risk_level: 'low' | 'medium' | 'high';
    recommendations: string[];
  }> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'predict_performance',
        studentId
      }
    });

    if (error) throw error;
    return data;
  }

  // Generate evaluation recommendations
  static async generateEvaluationRecommendations(subjectId: string): Promise<{
    recommendations: Array<{
      type: 'timing' | 'difficulty' | 'format' | 'weight';
      current: any;
      recommended: any;
      reason: string;
      impact: number;
    }>;
    optimal_schedule: Array<{
      evaluation_type: string;
      suggested_date: string;
      difficulty_level: number;
      weight_percentage: number;
    }>;
  }> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'evaluation_recommendations',
        subjectId
      }
    });

    if (error) throw error;
    return data;
  }

  // Analyze class performance
  static async analyzeClassPerformance(params: {
    programId?: string;
    subjectId?: string;
    semester?: number;
    compareWith?: 'previous_semester' | 'other_classes' | 'historical_data';
  }): Promise<{
    overall_stats: {
      average: number;
      median: number;
      std_deviation: number;
      pass_rate: number;
    };
    distribution: Array<{ range: string; count: number; percentage: number }>;
    comparisons: Array<{
      metric: string;
      current: number;
      comparison: number;
      difference: number;
      trend: 'improving' | 'declining' | 'stable';
    }>;
    insights: string[];
  }> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'analyze_class_performance',
        ...params
      }
    });

    if (error) throw error;
    return data;
  }

  // Optimize evaluation weights
  static async optimizeEvaluationWeights(subjectId: string): Promise<{
    current_weights: Array<{ evaluation_type: string; weight: number }>;
    optimized_weights: Array<{ evaluation_type: string; weight: number }>;
    expected_improvement: number;
    rationale: string[];
  }> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'optimize_weights',
        subjectId
      }
    });

    if (error) throw error;
    return data;
  }

  // Smart grade validation
  static async validateGradeEntry(grade: {
    studentId: string;
    subjectId: string;
    evaluationTypeId: string;
    grade: number;
    context?: any;
  }): Promise<{
    isValid: boolean;
    confidence: number;
    warnings: Array<{
      type: 'outlier' | 'inconsistent' | 'trend_deviation';
      message: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    suggestions: Array<{
      action: string;
      reason: string;
    }>;
  }> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'validate_grade',
        ...grade
      }
    });

    if (error) throw error;
    return data;
  }

  // Auto-generate feedback
  static async generateStudentFeedback(params: {
    studentId: string;
    subjectId: string;
    gradeData: any[];
    evaluationType: string;
  }): Promise<{
    feedback: string;
    tone: 'encouraging' | 'neutral' | 'constructive';
    key_points: string[];
    improvement_areas: string[];
    strengths: string[];
  }> {
    const { data, error } = await supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'generate_feedback',
        ...params
      }
    });

    if (error) throw error;
    return data;
  }

  // Real-time anomaly monitoring
  static subscribeToAnomalyDetection(
    onAnomalyDetected: (anomaly: Anomaly) => void,
    filters?: any
  ) {
    const channel = supabase
      .channel('anomaly-detection')
      .on('broadcast', { event: 'anomaly_detected' }, (payload) => {
        const anomaly = payload.payload as Anomaly;
        onAnomalyDetected(anomaly);
      })
      .subscribe();

    // Start monitoring
    supabase.functions.invoke('ai-analytics', {
      body: {
        action: 'start_monitoring',
        filters
      }
    });

    return () => {
      supabase.removeChannel(channel);
      supabase.functions.invoke('ai-analytics', {
        body: { action: 'stop_monitoring' }
      });
    };
  }
}