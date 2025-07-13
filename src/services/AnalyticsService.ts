import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsMetric {
  id: string;
  metric_type: string;
  metric_name: string;
  value?: number;
  string_value?: string;
  dimensions: any;
  time_period: string;
  reference_date: string;
  calculated_at: string;
  created_at: string;
}

export interface DashboardMetrics {
  totalStudents: number;
  totalSubjects: number;
  totalGrades: number;
  averageGrade: number;
  successRate: number;
  lastUpdated: string;
}

export interface CollaborationSession {
  sessionId: string;
  activeUsers: Array<{
    id: string;
    name: string;
    joinedAt: string;
  }>;
}

export class AnalyticsService {
  
  // Get dashboard metrics
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    const { data, error } = await supabase.functions.invoke('realtime-analytics/dashboard');
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Get grades distribution
  static async getGradesDistribution(): Promise<Array<{range: string, count: number}>> {
    const { data, error } = await supabase.functions.invoke('realtime-analytics/grades-distribution');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  // Get success trends
  static async getSuccessTrends(): Promise<Array<{month: string, successRate: number}>> {
    const { data, error } = await supabase.functions.invoke('realtime-analytics/success-trends');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  // Get live metrics
  static async getLiveMetrics(): Promise<AnalyticsMetric[]> {
    const { data, error } = await supabase.functions.invoke('realtime-analytics/live-metrics');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  // Calculate specific metric
  static async calculateMetric(metricType: string, filters?: any): Promise<{name: string, value: number}> {
    const { data, error } = await supabase.functions.invoke('realtime-analytics/calculate-metrics', {
      body: {
        metricType,
        filters
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Join collaboration session
  static async joinCollaborationSession(
    sessionType: string, 
    resourceId: string, 
    userName: string
  ): Promise<CollaborationSession> {
    const user = (await supabase.auth.getUser()).data.user;
    
    const { data, error } = await supabase.functions.invoke('realtime-analytics/collaboration-join', {
      body: {
        sessionType,
        resourceId,
        userId: user?.id,
        userName: userName || user?.email || 'Anonymous'
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  // Leave collaboration session
  static async leaveCollaborationSession(sessionId: string): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    
    const { error } = await supabase.functions.invoke('realtime-analytics/collaboration-leave', {
      body: {
        sessionId,
        userId: user?.id
      }
    });
    
    if (error) {
      throw error;
    }
  }

  // Subscribe to real-time updates
  static subscribeToRealTimeUpdates(
    onMetricUpdate: (metric: AnalyticsMetric) => void,
    onCollaborationUpdate: (users: any[]) => void
  ) {
    // Subscribe to analytics_metrics table changes
    const metricsChannel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_metrics'
        },
        (payload) => {
          onMetricUpdate(payload.new as AnalyticsMetric);
        }
      )
      .subscribe();

    // Subscribe to collaboration_sessions table changes
    const collaborationChannel = supabase
      .channel('collaboration-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'collaboration_sessions'
        },
        (payload) => {
          onCollaborationUpdate(payload.new.active_users || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(metricsChannel);
      supabase.removeChannel(collaborationChannel);
    };
  }

  // Get historical metrics
  static async getHistoricalMetrics(
    metricType: string, 
    startDate: string, 
    endDate: string
  ): Promise<AnalyticsMetric[]> {
    const { data, error } = await supabase
      .from('analytics_metrics')
      .select('*')
      .eq('metric_type', metricType)
      .gte('reference_date', startDate)
      .lte('reference_date', endDate)
      .order('reference_date', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Export analytics data
  static async exportAnalyticsData(
    format: 'csv' | 'excel',
    filters?: any
  ): Promise<{downloadUrl: string, fileName: string}> {
    const { data, error } = await supabase.functions.invoke('export-data', {
      body: {
        type: 'analytics',
        format,
        filters
      }
    });
    
    if (error) {
      throw error;
    }
    
    return {
      downloadUrl: data.downloadUrl,
      fileName: data.fileName
    };
  }
}