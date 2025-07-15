import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CalculationError {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface CalculationMetrics {
  totalCalculations: number;
  successRate: number;
  averageExecutionTime: number;
  errorRate: number;
  cacheHitRate: number;
  queueLength: number;
}

export function useCalculationMonitoring() {
  const [errors, setErrors] = useState<CalculationError[]>([]);
  const [metrics, setMetrics] = useState<CalculationMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  // Real-time error tracking
  const logError = useCallback((error: CalculationError) => {
    setErrors(prev => [error, ...prev.slice(0, 99)]); // Keep last 100 errors
    
    // Show critical errors as toasts
    if (error.type === 'critical') {
      toast({
        title: "Erreur critique de calcul",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Performance monitoring
  const updateMetrics = useCallback(async () => {
    try {
      // Get calculation statistics from database
      const { data: recentCalculations, error } = await supabase
        .from('calculation_history')
        .select('*')
        .gte('started_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('started_at', { ascending: false });

      if (error) throw error;

      if (recentCalculations && recentCalculations.length > 0) {
        const total = recentCalculations.length;
        const successful = recentCalculations.filter(c => c.status === 'success').length;
        const totalTime = recentCalculations
          .filter(c => c.execution_time_ms)
          .reduce((sum, c) => sum + (c.execution_time_ms || 0), 0);
        
        const newMetrics: CalculationMetrics = {
          totalCalculations: total,
          successRate: (successful / total) * 100,
          averageExecutionTime: totalTime / total,
          errorRate: ((total - successful) / total) * 100,
          cacheHitRate: 0, // Would be calculated from cache stats
          queueLength: 0 // Would be from queue service
        };

        setMetrics(newMetrics);
      }
    } catch (error) {
      console.error('Failed to update calculation metrics:', error);
    }
  }, []);

  // Monitor calculation performance
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds
    updateMetrics(); // Initial load

    return () => clearInterval(interval);
  }, [isMonitoring, updateMetrics]);

  // Real-time calculation events
  useEffect(() => {
    if (!isMonitoring) return;

    const channel = supabase
      .channel('calculation-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calculation_history'
        },
        (payload) => {
          if (payload.new.status === 'error') {
            logError({
              id: payload.new.id,
              type: 'calculation',
              message: payload.new.metadata?.error_message || 'Calculation failed',
              timestamp: new Date(payload.new.started_at),
              context: payload.new.parameters
            });
          }
          updateMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isMonitoring, logError, updateMetrics]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    toast({
      title: "Monitoring activé",
      description: "Surveillance des calculs en temps réel",
    });
  }, [toast]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    toast({
      title: "Monitoring désactivé",
      description: "Surveillance des calculs arrêtée",
    });
  }, [toast]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Health check
  const performHealthCheck = useCallback(async () => {
    try {
      const startTime = Date.now();
      
      // Test database connectivity
      const { error: dbError } = await supabase
        .from('academic_years')
        .select('id')
        .limit(1);

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      // Test calculation function
      const { error: calcError } = await supabase
        .rpc('get_academic_stats');

      if (calcError) throw new Error(`Calculation function error: ${calcError.message}`);

      const responseTime = Date.now() - startTime;
      
      toast({
        title: "Système opérationnel",
        description: `Temps de réponse: ${responseTime}ms`,
      });

      return {
        healthy: true,
        responseTime,
        timestamp: new Date()
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Health check failed';
      
      logError({
        id: crypto.randomUUID(),
        type: 'health_check',
        message: errorMsg,
        timestamp: new Date()
      });

      toast({
        title: "Problème système détecté",
        description: errorMsg,
        variant: "destructive",
      });

      return {
        healthy: false,
        error: errorMsg,
        timestamp: new Date()
      };
    }
  }, [logError, toast]);

  return {
    errors,
    metrics,
    isMonitoring,
    logError,
    startMonitoring,
    stopMonitoring,
    clearErrors,
    performHealthCheck,
    updateMetrics
  };
}