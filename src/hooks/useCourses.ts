import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Course = {
  id: string;
  title: string;
  description?: string | null;
  code: string;
  instructor_id?: string | null;
  category_id?: string | null;
  status: string;
  difficulty_level: string;
  estimated_duration?: number | null;
  thumbnail_url?: string | null;
  is_published: boolean;
  enrollment_limit?: number | null;
  enrollment_start_date?: string | null;
  enrollment_end_date?: string | null;
  course_start_date?: string | null;
  course_end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des cours');
      toast({
        title: "Erreur",
        description: "Impossible de charger les cours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: { title: string; code: string; [key: string]: any }) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) throw error;

      setCourses(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Cours créé avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le cours",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCourses(prev => prev.map(course => 
        course.id === id ? { ...course, ...data } : course
      ));
      
      toast({
        title: "Succès",
        description: "Cours mis à jour avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le cours",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCourses(prev => prev.filter(course => course.id !== id));
      toast({
        title: "Succès",
        description: "Cours supprimé avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}