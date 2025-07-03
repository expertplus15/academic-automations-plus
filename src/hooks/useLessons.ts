import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  lesson_type: string;
  content?: any;
  order_index: number;
  duration_minutes?: number | null;
  video_url?: string | null;
  is_mandatory: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useLessons(courseId?: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  const fetchLessons = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;
      setLessons(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des leçons');
      toast({
        title: "Erreur",
        description: "Impossible de charger les leçons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createLesson = async (lessonData: Partial<Lesson>) => {
    try {
      const maxOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order_index)) : 0;
      
      const newLesson = {
        course_id: lessonData.course_id!,
        title: lessonData.title || 'Nouvelle leçon',
        description: lessonData.description || null,
        lesson_type: lessonData.lesson_type || 'content',
        content: lessonData.content || {},
        order_index: maxOrder + 1,
        duration_minutes: lessonData.duration_minutes || null,
        video_url: lessonData.video_url || null,
        is_mandatory: lessonData.is_mandatory ?? true,
        is_published: lessonData.is_published ?? false,
      };
      
      const { data, error } = await supabase
        .from('lessons')
        .insert([newLesson])
        .select()
        .single();

      if (error) throw error;

      setLessons(prev => [...prev, data]);
      toast({
        title: "Succès",
        description: "Leçon créée avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la leçon",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateLesson = async (id: string, updates: Partial<Lesson>) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setLessons(prev => prev.map(lesson => 
        lesson.id === id ? { ...lesson, ...data } : lesson
      ));
      
      toast({
        title: "Succès",
        description: "Leçon mise à jour avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la leçon",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLessons(prev => prev.filter(lesson => lesson.id !== id));
      toast({
        title: "Succès",
        description: "Leçon supprimée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la leçon",
        variant: "destructive",
      });
      throw err;
    }
  };

  const reorderLessons = async (lessonIds: string[]) => {
    try {
      const updates = lessonIds.map((id, index) => ({
        id,
        order_index: index + 1,
      }));

      for (const update of updates) {
        await supabase
          .from('lessons')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      await fetchLessons(); // Refresh the list
      
      toast({
        title: "Succès",
        description: "Ordre des leçons mis à jour",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les leçons",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    lessons,
    loading,
    error,
    fetchLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
  };
}