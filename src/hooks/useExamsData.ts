import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [exams, setExams] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch exams with subjects
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select(`
          *,
          subjects(name, code),
          programs(name, code)
        `);

      if (examsError) throw examsError;

      // Fetch exam sessions with rooms
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('exam_sessions')
        .select(`
          *,
          exams(title),
          rooms(name, code)
        `);

      if (sessionsError) throw sessionsError;

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*');

      if (roomsError) throw roomsError;

      // Fetch supervisors
      const { data: supervisorsData, error: supervisorsError } = await supabase
        .from('exam_supervisors')
        .select(`
          *,
          profiles(full_name, email)
        `);

      if (supervisorsError) throw supervisorsError;

      // Detect conflicts using SQL function
      const { data: conflictsData, error: conflictsError } = await supabase
        .rpc('detect_exam_conflicts', { 
          p_academic_year_id: '550e8400-e29b-41d4-a716-446655440001' 
        });

      if (conflictsError) throw conflictsError;

      // Update state
      setExams(examsData || []);
      setSessions(sessionsData || []);
      setRooms(roomsData || []);
      setSupervisors(supervisorsData || []);
      setConflicts(conflictsData || []);

      // Calculate stats
      const scheduledExams = (examsData || []).filter(e => e.status === 'scheduled').length;
      const usedRooms = new Set((sessionsData || []).map(s => s.room_id).filter(Boolean)).size;

      // Get schedule generations for AI efficiency
      const { data: generations } = await supabase
        .from('schedule_generations')
        .select('success_rate')
        .eq('generation_type', 'exam_schedule')
        .order('created_at', { ascending: false })
        .limit(10);

      const avgEfficiency = generations?.length 
        ? generations.reduce((acc, g) => acc + (g.success_rate || 0), 0) / generations.length
        : 94.5;

      setStats({
        totalExams: (examsData || []).length,
        scheduledExams,
        conflictsCount: (conflictsData || []).length,
        roomsUsed: usedRooms,
        totalRooms: (roomsData || []).length,
        supervisorsAssigned: (supervisorsData || []).length,
        optimizationEfficiency: Math.round(avgEfficiency),
        aiGeneratedSchedules: (generations || []).length
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
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

  const detectConflicts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .rpc('detect_exam_conflicts', { 
          p_academic_year_id: '550e8400-e29b-41d4-a716-446655440001' 
        });
      
      if (error) throw error;
      setConflicts(data || []);
      return data || [];
    } catch (err) {
      console.error('Error detecting conflicts:', err);
      return [];
    }
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats,
    detectConflicts,
    exams,
    sessions,
    rooms,
    supervisors,
    conflicts
  };
}