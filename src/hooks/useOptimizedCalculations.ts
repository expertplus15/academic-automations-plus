import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculationCache } from '@/services/CalculationCache';
import { calculationQueue } from '@/services/CalculationQueue';
import { CalculationOptions, CalculationResult } from '@/types/calculations';
import { StudentAverages } from './useGradeCalculations';

export interface PerformanceMetrics {
  cacheHitRate: number;
  averageExecutionTime: number;
  queueStatus: {
    pending: number;
    running: number;
    total: number;
  };
}

export function useOptimizedCalculations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const { toast } = useToast();

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const cacheStats = calculationCache.getStats();
      const queueStatus = calculationQueue.getQueueStatus();
      
      setMetrics({
        cacheHitRate: cacheStats.hitRate,
        averageExecutionTime: 0, // TODO: Track this
        queueStatus
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Optimized student averages calculation with caching
  const calculateStudentAveragesOptimized = useCallback(async (
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
      const { data, error } = await supabase.rpc('calculate_student_averages', {
        p_student_id: studentId,
        p_academic_year_id: academicYearId,
        p_semester: semester || null
      });

      if (error) throw error;

      const result = data as unknown as StudentAverages;
      
      // Cache the result
      calculationCache.set(cacheKey, params, result, 5 * 60 * 1000); // 5 minutes TTL
      
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

  // Batch calculation for multiple students
  const calculateBatchAverages = useCallback(async (
    studentIds: string[],
    academicYearId: string,
    semester?: number
  ): Promise<StudentAverages[]> => {
    setLoading(true);
    setError(null);

    try {
      const results: StudentAverages[] = [];
      const uncachedStudents: string[] = [];

      // Check cache for each student
      for (const studentId of studentIds) {
        const params = { studentId, academicYearId, semester: semester || 'all' };
        const cached = calculationCache.get<StudentAverages>('student_averages', params);
        
        if (cached) {
          results.push(cached);
        } else {
          uncachedStudents.push(studentId);
        }
      }

      // Calculate only uncached students
      if (uncachedStudents.length > 0) {
        const batchPromises = uncachedStudents.map(studentId =>
          calculateStudentAveragesOptimized(studentId, academicYearId, semester)
        );

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(result => result !== null) as StudentAverages[]);
      }

      toast({
        title: "Calcul terminé",
        description: `${results.length} moyennes calculées (${studentIds.length - uncachedStudents.length} depuis le cache)`,
      });

      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du calcul batch';
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
  }, [calculateStudentAveragesOptimized, toast]);

  // Queue-based calculation execution
  const executeCalculationQueued = useCallback(async (
    options: CalculationOptions
  ): Promise<CalculationResult> => {
    setLoading(true);
    
    try {
      const result = await calculationQueue.add(options);
      
      if (result.status === 'success') {
        toast({
          title: "Calcul terminé",
          description: result.message,
        });
        
        // Invalidate relevant cache entries
        if (options.params.studentId) {
          calculationCache.invalidateStudent(options.params.studentId);
        }
        if (options.params.academicYearId) {
          calculationCache.invalidateAcademicYear(options.params.academicYearId);
        }
      } else {
        toast({
          title: "Erreur de calcul",
          description: result.message,
          variant: "destructive",
        });
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'exécution';
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Background calculation with Web Worker simulation
  const executeBackgroundCalculation = useCallback(async (
    options: CalculationOptions
  ): Promise<void> => {
    // Simulate background processing
    setTimeout(async () => {
      try {
        await executeCalculationQueued({
          ...options,
          async: true,
          notifications: true
        });
      } catch (error) {
        console.error('Background calculation failed:', error);
      }
    }, 100);
  }, [executeCalculationQueued]);

  // Cache management
  const clearCache = useCallback(() => {
    calculationCache.clear();
    toast({
      title: "Cache vidé",
      description: "Le cache des calculs a été vidé",
    });
  }, [toast]);

  const invalidateStudentCache = useCallback((studentId: string) => {
    calculationCache.invalidateStudent(studentId);
  }, []);

  return {
    loading,
    error,
    metrics,
    calculateStudentAveragesOptimized,
    calculateBatchAverages,
    executeCalculationQueued,
    executeBackgroundCalculation,
    clearCache,
    invalidateStudentCache
  };
}