import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useExams } from './useExams';
import { useRooms } from './useRooms';
import { useSupervisors } from './useSupervisors';
import { useExamConflictDetection } from './useExamConflictDetection';

export interface ExamDashboardStats {
  totalExams: number;
  scheduledExams: number;
  conflictsCount: number;
  roomsUsed: number;
  totalRooms: number;
  supervisorsAssigned: number;
  optimizationEfficiency: number;
  aiGeneratedSchedules: number;
}

export function useExamsData() {
  const [stats, setStats] = useState<ExamDashboardStats>({
    totalExams: 0,
    scheduledExams: 0,
    conflictsCount: 0,
    roomsUsed: 0,
    totalRooms: 0,
    supervisorsAssigned: 0,
    optimizationEfficiency: 0,
    aiGeneratedSchedules: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { exams, sessions, fetchExams } = useExams();
  const { rooms } = useRooms();
  const { supervisors } = useSupervisors();
  const { conflicts, detectConflicts } = useExamConflictDetection();

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      await Promise.all([
        fetchExams(),
        detectConflicts()
      ]);

      // Calculate stats
      const scheduledExams = exams.filter(e => e.status === 'scheduled').length;
      const usedRooms = new Set(sessions.map(s => s.room_id).filter(Boolean)).size;
      
      // Get supervisors count
      const { data: supervisorCount } = await supabase
        .from('exam_supervisors')
        .select('teacher_id', { count: 'exact' });

      // Get schedule generations for AI efficiency
      const { data: generations } = await supabase
        .from('schedule_generations')
        .select('success_rate')
        .eq('generation_type', 'exam_schedule')
        .order('created_at', { ascending: false })
        .limit(10);

      const avgEfficiency = generations?.length 
        ? generations.reduce((acc, g) => acc + (g.success_rate || 0), 0) / generations.length
        : 0;

      setStats({
        totalExams: exams.length,
        scheduledExams,
        conflictsCount: conflicts.length,
        roomsUsed: usedRooms,
        totalRooms: rooms.length,
        supervisorsAssigned: supervisorCount?.length || 0,
        optimizationEfficiency: Math.round(avgEfficiency),
        aiGeneratedSchedules: generations?.length || 0
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [exams, sessions, rooms, supervisors, conflicts, fetchExams, detectConflicts]);

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
    exams,
    sessions,
    rooms,
    supervisors,
    conflicts
  };
}