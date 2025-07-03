import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type CourseEnrollment = {
  id: string;
  course_id: string;
  student_id: string;
  enrollment_date: string | null;
  completion_date?: string | null;
  progress_percentage: number | null;
  status: string;
  final_grade?: number | null;
  certificate_url?: string | null;
}

export function useCourseEnrollments(courseId?: string) {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      fetchEnrollments();
    }
  }, [courseId]);

  const fetchEnrollments = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('course_id', courseId)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des inscriptions');
      toast({
        title: "Erreur",
        description: "Impossible de charger les inscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const enrollStudent = async (studentId: string, courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([{
          course_id: courseId,
          student_id: studentId,
          status: 'enrolled'
        }])
        .select()
        .single();

      if (error) throw error;

      setEnrollments(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Étudiant inscrit avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'inscrire l'étudiant",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateProgress = async (enrollmentId: string, progressPercentage: number) => {
    try {
      const status = progressPercentage >= 100 ? 'completed' : 'in_progress';
      const completion_date = progressPercentage >= 100 ? new Date().toISOString() : null;

      const { data, error } = await supabase
        .from('course_enrollments')
        .update({ 
          progress_percentage: progressPercentage,
          status,
          completion_date
        })
        .eq('id', enrollmentId)
        .select()
        .single();

      if (error) throw error;

      setEnrollments(prev => prev.map(enrollment => 
        enrollment.id === enrollmentId ? { ...enrollment, ...data } : enrollment
      ));
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la progression",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    enrollStudent,
    updateProgress,
  };
}