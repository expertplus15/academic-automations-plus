import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Forum = {
  id: string;
  course_id?: string | null;
  title: string;
  description?: string | null;
  category: string;
  is_general: boolean;
  is_moderated: boolean;
  is_locked: boolean;
  posts_count: number;
  last_post_at?: string | null;
  last_post_by?: string | null;
  display_order: number;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export function useForums(courseId?: string) {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchForums();
  }, [courseId]);

  const fetchForums = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('forums')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setForums(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des forums');
      toast({
        title: "Erreur",
        description: "Impossible de charger les forums",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createForum = async (forumData: any) => {
    try {
      const { data, error } = await supabase
        .from('forums')
        .insert([forumData])
        .select()
        .single();

      if (error) throw error;

      setForums(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Forum créé avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le forum",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateForum = async (id: string, updates: Partial<Forum>) => {
    try {
      const { data, error } = await supabase
        .from('forums')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setForums(prev => prev.map(forum => 
        forum.id === id ? { ...forum, ...data } : forum
      ));
      
      toast({
        title: "Succès",
        description: "Forum mis à jour avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le forum",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteForum = async (id: string) => {
    try {
      const { error } = await supabase
        .from('forums')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setForums(prev => prev.filter(forum => forum.id !== id));
      toast({
        title: "Succès",
        description: "Forum supprimé avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le forum",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    forums,
    loading,
    error,
    fetchForums,
    createForum,
    updateForum,
    deleteForum,
  };
}