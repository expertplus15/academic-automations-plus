import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type StudentBadge = {
  id: string;
  student_id: string;
  badge_id: string;
  awarded_at: string;
  awarded_by?: string | null;
  criteria_met: any;
  is_visible: boolean;
  badge: {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    badge_type: string;
    points_value: number;
  };
}

type StudentPoints = {
  id: string;
  student_id: string;
  points: number;
  point_type: string;
  reference_id?: string | null;
  reference_type?: string | null;
  description?: string | null;
  earned_at: string;
  academic_year_id?: string | null;
}

export function useGamification(studentId?: string) {
  const [badges, setBadges] = useState<StudentBadge[]>([]);
  const [points, setPoints] = useState<StudentPoints[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      // Fetch student badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('student_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('student_id', studentId)
        .eq('is_visible', true)
        .order('awarded_at', { ascending: false });

      if (badgesError) throw badgesError;

      // Fetch student points
      const { data: pointsData, error: pointsError } = await supabase
        .from('student_points')
        .select('*')
        .eq('student_id', studentId)
        .order('earned_at', { ascending: false });

      if (pointsError) throw pointsError;

      setBadges(badgesData || []);
      setPoints(pointsData || []);
      
      // Calculate total points
      const total = (pointsData || []).reduce((sum, point) => sum + point.points, 0);
      setTotalPoints(total);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de gamification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const awardBadge = async (studentId: string, badgeId: string, criteriaMet: any = {}) => {
    try {
      const { data, error } = await supabase
        .from('student_badges')
        .insert([{
          student_id: studentId,
          badge_id: badgeId,
          criteria_met: criteriaMet,
          awarded_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select(`
          *,
          badge:badges(*)
        `)
        .single();

      if (error) throw error;

      setBadges(prev => [data, ...prev]);
      toast({
        title: "Badge attribué !",
        description: `Badge "${data.badge.name}" attribué avec succès`,
      });
      
      return data;
    } catch (err) {
      // Ignore duplicate badge errors
      if (err instanceof Error && err.message.includes('duplicate')) {
        return null;
      }
      
      toast({
        title: "Erreur",
        description: "Impossible d'attribuer le badge",
        variant: "destructive",
      });
      throw err;
    }
  };

  const addPoints = async (
    studentId: string, 
    points: number, 
    pointType: string, 
    description?: string,
    referenceId?: string,
    referenceType?: string,
    academicYearId?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('student_points')
        .insert([{
          student_id: studentId,
          points: points,
          point_type: pointType,
          description: description,
          reference_id: referenceId,
          reference_type: referenceType,
          academic_year_id: academicYearId
        }])
        .select()
        .single();

      if (error) throw error;

      setPoints(prev => [data, ...prev]);
      setTotalPoints(prev => prev + points);
      
      toast({
        title: "Points gagnés !",
        description: `+${points} points pour ${description || pointType}`,
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les points",
        variant: "destructive",
      });
      throw err;
    }
  };

  const getLeaderboard = async (academicYearId?: string, limit: number = 10) => {
    try {
      let query = supabase
        .from('student_points')
        .select(`
          student_id,
          students!inner(profile_id, profiles(full_name)),
          points
        `);

      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by student and sum points
      const studentTotals = (data || []).reduce((acc: any, point: any) => {
        const studentId = point.student_id;
        if (!acc[studentId]) {
          acc[studentId] = {
            student_id: studentId,
            full_name: point.students.profiles.full_name,
            total_points: 0
          };
        }
        acc[studentId].total_points += point.points;
        return acc;
      }, {});

      // Convert to array and sort
      const leaderboard = Object.values(studentTotals)
        .sort((a: any, b: any) => b.total_points - a.total_points)
        .slice(0, limit);

      return leaderboard;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le classement",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    badges,
    points,
    totalPoints,
    loading,
    error,
    fetchStudentData,
    awardBadge,
    addPoints,
    getLeaderboard,
  };
}