import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalStudents: number;
  newThisMonth: number;
  activeStudents: number;
  pendingEnrollments: number;
  retentionRate: number;
  averageEnrollmentTime: number;
}

interface RecentEnrollment {
  id: string;
  student_number: string;
  full_name: string;
  program_name: string;
  status: string;
  enrollment_date: string;
  created_at: string;
}

interface ProgramDistribution {
  program_name: string;
  student_count: number;
  percentage: number;
}

export function useStudentsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    newThisMonth: 0,
    activeStudents: 0,
    pendingEnrollments: 0,
    retentionRate: 0,
    averageEnrollmentTime: 26.3
  });
  
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [programDistribution, setProgramDistribution] = useState<ProgramDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get total students count
      const { count: totalCount, error: totalError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get active students count
      const { count: activeCount, error: activeError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (activeError) throw activeError;

      // Get new students this month count
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const { count: newCount, error: newError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .gte('enrollment_date', startOfMonth.toISOString());

      if (newError) throw newError;

      // Calculate retention rate (simplified: active students / total students)
      const retentionRate = totalCount && totalCount > 0 
        ? Math.round((activeCount || 0) / totalCount * 100) 
        : 0;

      setStats({
        totalStudents: totalCount || 0,
        activeStudents: activeCount || 0,
        newThisMonth: newCount || 0,
        pendingEnrollments: 0, // TODO: Add pending status calculation
        retentionRate,
        averageEnrollmentTime: 26.3 // Mock data for now
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Erreur lors du chargement des statistiques');
    }
  };

  const fetchRecentEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          status,
          enrollment_date,
          created_at,
          profiles!students_profile_id_fkey (
            full_name
          ),
          programs!students_program_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const mappedEnrollments: RecentEnrollment[] = (data || []).map(student => ({
        id: student.id,
        student_number: student.student_number,
        full_name: student.profiles?.full_name || 'Nom non disponible',
        program_name: student.programs?.name || 'Programme non disponible',
        status: student.status,
        enrollment_date: student.enrollment_date,
        created_at: student.created_at
      }));

      setRecentEnrollments(mappedEnrollments);

    } catch (err) {
      console.error('Error fetching recent enrollments:', err);
    }
  };

  const fetchProgramDistribution = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          programs!students_program_id_fkey (
            name
          )
        `)
        .eq('status', 'active');

      if (error) throw error;

      // Count students by program
      const programCounts: { [key: string]: number } = {};
      let totalActive = 0;

      (data || []).forEach(student => {
        const programName = student.programs?.name || 'Programme inconnu';
        programCounts[programName] = (programCounts[programName] || 0) + 1;
        totalActive++;
      });

      // Convert to array with percentages
      const distribution: ProgramDistribution[] = Object.entries(programCounts)
        .map(([program_name, student_count]) => ({
          program_name,
          student_count,
          percentage: totalActive > 0 ? Math.round((student_count / totalActive) * 100) : 0
        }))
        .sort((a, b) => b.student_count - a.student_count);

      setProgramDistribution(distribution);

    } catch (err) {
      console.error('Error fetching program distribution:', err);
    }
  };

  const refreshData = async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchRecentEnrollments(),
      fetchProgramDistribution()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    stats,
    recentEnrollments,
    programDistribution,
    loading,
    error,
    refreshData
  };
}