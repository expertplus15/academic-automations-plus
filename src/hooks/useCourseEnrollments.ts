import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type CourseEnrollment = {
  id: string;
  course_id: string;
  student_id: string;
  enrollment_date: string;
  completion_date?: string | null;
  progress_percentage: number;
  final_grade?: number | null;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  // Relations
  course?: {
    title: string;
    code: string;
    instructor_id: string;
  };
  student?: {
    student_number: string;
    profile: {
      full_name?: string | null;
      email: string;
    } | null;
  };
}

export function useCourseEnrollments(courseId?: string) {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEnrollments();
  }, [courseId]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(title, code, instructor_id),
          student:students(
            student_number,
            profile:profiles(full_name, email)
          )
        `)
        .order('enrollment_date', { ascending: false });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEnrollments(data as any || []);
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

  const enrollStudent = async (courseId: string, studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([{
          course_id: courseId,
          student_id: studentId,
          status: 'enrolled',
          payment_status: 'pending'
        }])
        .select(`
          *,
          course:courses(title, code, instructor_id),
          student:students(
            student_number,
            profile:profiles(full_name, email)
          )
        `)
        .single();

      if (error) throw error;

      setEnrollments(prev => [data as any, ...prev]);
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

  const updateEnrollment = async (id: string, updates: Partial<CourseEnrollment>) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          course:courses(title, code, instructor_id),
          student:students(
            student_number,
            profile:profiles(full_name, email)
          )
        `)
        .single();

      if (error) throw error;

      setEnrollments(prev => prev.map(enrollment => 
        enrollment.id === id ? { ...enrollment, ...data } : enrollment
      ));
      
      toast({
        title: "Succès",
        description: "Inscription mise à jour avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'inscription",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteEnrollment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEnrollments(prev => prev.filter(enrollment => enrollment.id !== id));
      toast({
        title: "Succès",
        description: "Inscription supprimée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'inscription",
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
    updateEnrollment,
    deleteEnrollment,
  };
}